import express from "express";
import { Op } from "sequelize";
import db from "../config/Sequelize.js";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { User, Project, ProjectMembers, Task, Comment, ActivityLog } from "../models/index.js";
import { describeTaskChanges, recordTaskEvent } from "../services/taskEventService.js";

const router = express.Router();
router.use(verifyJwt);
router.use(async (req, res, next) => {
    try {
        const admin = await User.findByPk(req.user.user_id, { attributes: ["user_id", "privilege", "is_active"] });
        if (!admin || admin.privilege !== 1 || admin.is_active === 0) {
            return res.status(403).json({ message: "Admin access required." });
        }
        next();
    } catch (error) { next(error); }
});

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
const id = (value) => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
const choice = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;
const title = (value) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= 255;

router.get("/overview", asyncRoute(async (_req, res) => {
    const [users, projects, memberships, tasks] = await Promise.all([
        User.findAll({ attributes: ["user_id", "first_name", "last_name", "email", "privilege", "is_active"], order: [["user_id", "ASC"]] }),
        Project.findAll({ order: [["project_id", "ASC"]] }),
        ProjectMembers.findAll({ attributes: ["project_id", "user_id"], order: [["id", "ASC"]] }),
        Task.findAll({ order: [["task_id", "ASC"]] })
    ]);
    res.json({ users, projects, memberships, tasks });
}));

router.patch("/users/:userId", asyncRoute(async (req, res) => {
    const userId = id(req.params.userId);
    if (!userId || ![1, 2, 3].includes(req.body.privilege)) return res.status(400).json({ message: "Invalid user or privilege." });
    if (userId === req.user.user_id && req.body.privilege !== 1) return res.status(400).json({ message: "You cannot remove your own admin privilege." });
    const user = await User.findByPk(userId);
    if (!user || user.is_active === 0) return res.status(404).json({ message: "Active user not found." });
    await user.update({ privilege: req.body.privilege });
    res.json({ message: "Privilege updated." });
}));

router.delete("/users/:userId", asyncRoute(async (req, res) => {
    const userId = id(req.params.userId);
    if (!userId) return res.status(400).json({ message: "Invalid user." });
    if (userId === req.user.user_id) return res.status(400).json({ message: "You cannot remove your own account." });
    const user = await User.findByPk(userId);
    if (!user || user.is_active === 0) return res.status(404).json({ message: "Active user not found." });
    await db.transaction(async (transaction) => {
        await ProjectMembers.destroy({ where: { user_id: userId }, transaction });
        await Task.update({ assignee_id: null }, { where: { assignee_id: userId }, transaction });
        await user.update({ is_active: 0 }, { transaction });
    });
    res.json({ message: "Member removed." });
}));

router.post("/tasks", asyncRoute(async (req, res) => {
    const { task_heading, task_description = "", task_priority = 0, task_status = 0 } = req.body;
    const projectId = req.body.project_id == null ? null : id(req.body.project_id);
    const assigneeId = req.body.assignee_id == null ? null : id(req.body.assignee_id);
    if (!title(task_heading) || typeof task_description !== "string" || !choice(task_priority, 2) || !choice(task_status, 4) ||
        (req.body.project_id != null && !projectId) || (req.body.assignee_id != null && !assigneeId)) {
        return res.status(400).json({ message: "Invalid task details." });
    }
    if (projectId && !await Project.findByPk(projectId)) return res.status(400).json({ message: "Project not found." });
    if (assigneeId && !await User.findOne({ where: { user_id: assigneeId, is_active: { [Op.ne]: 0 } } })) {
        return res.status(400).json({ message: "Active assignee not found." });
    }
    const task = await db.transaction(async (transaction) => {
        const created = await Task.create({
            task_heading: task_heading.trim(), task_description, task_priority, task_status,
            project_id: projectId, assignee_id: assigneeId
        }, { transaction });
        await recordTaskEvent(created.task_id, req.user.user_id, "Task created.", transaction);
        return created;
    });
    res.status(201).json({ task });
}));

router.patch("/tasks/:taskId", asyncRoute(async (req, res) => {
    const task = id(req.params.taskId) && await Task.findByPk(id(req.params.taskId));
    if (!task) return res.status(404).json({ message: "Task not found." });
    const allowed = ["task_heading", "task_description", "task_priority", "task_status", "project_id", "assignee_id"];
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (!Object.keys(changes).length || ("task_heading" in changes && !title(changes.task_heading)) ||
        ("task_description" in changes && typeof changes.task_description !== "string") ||
        ("task_priority" in changes && !choice(changes.task_priority, 2)) ||
        ("task_status" in changes && !choice(changes.task_status, 4)) ||
        ("project_id" in changes && changes.project_id !== null && !id(changes.project_id)) ||
        ("assignee_id" in changes && changes.assignee_id !== null && !id(changes.assignee_id))) {
        return res.status(400).json({ message: "Invalid task details." });
    }
    if (changes.project_id != null && !await Project.findByPk(changes.project_id)) return res.status(400).json({ message: "Project not found." });
    if (changes.assignee_id != null && !await User.findOne({ where: { user_id: changes.assignee_id, is_active: { [Op.ne]: 0 } } })) {
        return res.status(400).json({ message: "Active assignee not found." });
    }
    if (changes.task_heading) changes.task_heading = changes.task_heading.trim();
    const actualChanges = Object.fromEntries(
        Object.entries(changes).filter(([key, value]) => value !== task[key])
    );
    if (Object.keys(actualChanges).length === 0) return res.json({ task });

    await db.transaction(async (transaction) => {
        await task.update(actualChanges, { transaction });
        await recordTaskEvent(task.task_id, req.user.user_id, describeTaskChanges(actualChanges), transaction);
    });
    res.json({ task });
}));

router.delete("/tasks/:taskId", asyncRoute(async (req, res) => {
    const taskId = id(req.params.taskId);
    if (!taskId) return res.status(400).json({ message: "Invalid task." });
    await db.transaction(async (transaction) => {
        const task = await Task.findByPk(taskId, { transaction });
        if (!task) { const error = new Error("Task not found."); error.status = 404; throw error; }
        await Comment.destroy({ where: { task_id: taskId }, transaction });
        await ActivityLog.destroy({ where: { task_id: taskId }, transaction });
        await task.destroy({ transaction });
    });
    res.json({ message: "Task deleted." });
}));

router.post("/projects", asyncRoute(async (req, res) => {
    if (!title(req.body.project_name) || (req.body.project_status !== undefined && !choice(req.body.project_status, 2))) {
        return res.status(400).json({ message: "Invalid project details." });
    }
    const project = await db.transaction(async (transaction) => {
        const created = await Project.create({ project_name: req.body.project_name.trim(), project_status: req.body.project_status ?? 0 }, { transaction });
        await ProjectMembers.create({ project_id: created.project_id, user_id: req.user.user_id }, { transaction });
        return created;
    });
    res.status(201).json({ project });
}));

router.patch("/projects/:projectId", asyncRoute(async (req, res) => {
    const project = id(req.params.projectId) && await Project.findByPk(id(req.params.projectId));
    if (!project) return res.status(404).json({ message: "Project not found." });
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => ["project_name", "project_status"].includes(key)));
    if (!Object.keys(changes).length || ("project_name" in changes && !title(changes.project_name)) ||
        ("project_status" in changes && !choice(changes.project_status, 2))) return res.status(400).json({ message: "Invalid project details." });
    if (changes.project_name) changes.project_name = changes.project_name.trim();
    await project.update(changes);
    res.json({ project });
}));

router.delete("/projects/:projectId", asyncRoute(async (req, res) => {
    const projectId = id(req.params.projectId);
    if (!projectId) return res.status(400).json({ message: "Invalid project." });
    await db.transaction(async (transaction) => {
        const project = await Project.findByPk(projectId, { transaction });
        if (!project) { const error = new Error("Project not found."); error.status = 404; throw error; }
        if (await Task.count({ where: { project_id: projectId }, transaction })) {
            const error = new Error("Delete or move this project's tasks first."); error.status = 409; throw error;
        }
        await ProjectMembers.destroy({ where: { project_id: projectId }, transaction });
        await project.destroy({ transaction });
    });
    res.json({ message: "Project deleted." });
}));

router.post("/projects/:projectId/members", asyncRoute(async (req, res) => {
    const projectId = id(req.params.projectId), userId = id(req.body.member_id);
    if (!projectId || !userId) return res.status(400).json({ message: "Invalid project or member." });
    if (!await Project.findByPk(projectId)) return res.status(404).json({ message: "Project not found." });
    if (!await User.findOne({ where: { user_id: userId, is_active: { [Op.ne]: 0 } } })) return res.status(404).json({ message: "Active user not found." });
    if (await ProjectMembers.findOne({ where: { project_id: projectId, user_id: userId } })) return res.status(409).json({ message: "User is already a member." });
    await ProjectMembers.create({ project_id: projectId, user_id: userId });
    res.status(201).json({ message: "Member added." });
}));

router.delete("/projects/:projectId/members/:userId", asyncRoute(async (req, res) => {
    const projectId = id(req.params.projectId), userId = id(req.params.userId);
    if (!projectId || !userId) return res.status(400).json({ message: "Invalid project or member." });
    if (await Task.count({ where: { project_id: projectId, assignee_id: userId } })) {
        return res.status(409).json({ message: "Reassign or move this member's project tasks first." });
    }
    const removed = await ProjectMembers.destroy({ where: { project_id: projectId, user_id: userId } });
    if (!removed) return res.status(404).json({ message: "Membership not found." });
    res.json({ message: "Member removed from project." });
}));

router.use((error, _req, res, _next) => {
    res.status(error.status || 500).json({ message: error.status ? error.message : "Admin request failed." });
});

export default router;
