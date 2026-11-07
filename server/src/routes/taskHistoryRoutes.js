import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { User, Task, ProjectMembers, ActivityLog } from "../models/index.js";

const router = express.Router();
router.get("/:taskId/history", verifyJwt, async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        if (!Number.isSafeInteger(taskId) || taskId < 1) return res.status(400).json({ message: "Invalid task." });
        const task = await Task.findByPk(taskId);
        if (!task) return res.status(404).json({ message: "Task not found." });
        const user = await User.findByPk(req.user.user_id);
        if (!user || user.is_active === 0) return res.status(403).json({ message: "Access denied." });
        const member = task.project_id && await ProjectMembers.findOne({ where: { project_id: task.project_id, user_id: user.user_id } });
        if (user.privilege !== 1 && task.assignee_id !== user.user_id && !member) {
            return res.status(403).json({ message: "Access denied." });
        }
        const logs = await ActivityLog.findAll({ where: { task_id: taskId },
            attributes: ["log_id", "user_id", "log_description", "hours_logged", "created_at"],
            order: [["created_at", "DESC"], ["log_id", "DESC"]] });
        const authors = await User.findAll({ where: { user_id: [...new Set(logs.map((log) => log.user_id).filter(Boolean))] },
            attributes: ["user_id", "first_name", "last_name"] });
        const names = new Map(authors.map((author) => [author.user_id, `${author.first_name} ${author.last_name}`.trim()]));
        res.json({ logs: logs.map((log) => ({ ...log.toJSON(), author_name: names.get(log.user_id) || "Unknown member" })) });
    } catch (_error) {
        res.status(500).json({ message: "Unable to load activity history." });
    }
});
export default router;
