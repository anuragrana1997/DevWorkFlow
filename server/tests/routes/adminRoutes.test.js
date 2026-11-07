import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const findAdmin = jest.fn();
const users = { findByPk: findAdmin, findAll: jest.fn(), findOne: jest.fn() };
const projects = { findAll: jest.fn(), findByPk: jest.fn() };
const memberships = { findAll: jest.fn(), findOne: jest.fn(), destroy: jest.fn(), create: jest.fn() };
const tasks = { findAll: jest.fn(), count: jest.fn(), update: jest.fn(), create: jest.fn() };
const transaction = jest.fn((work) => work({}));
const createEvent = jest.fn();

jest.unstable_mockModule("../../src/middleware/authenticateMiddleware.js", () => ({
    verifyJwt: (req, _res, next) => { req.user = { user_id: 1, privilege: 1 }; next(); }
}));
jest.unstable_mockModule("../../src/models/index.js", () => ({
    User: users, Project: projects, ProjectMembers: memberships, Task: tasks,
    Comment: { destroy: jest.fn() }, ActivityLog: { destroy: jest.fn() }
}));
jest.unstable_mockModule("../../src/config/Sequelize.js", () => ({ default: { transaction } }));
jest.unstable_mockModule("../../src/models/ActivityLog.js", () => ({ default: { create: createEvent } }));

const { default: adminRouter } = await import("../../src/routes/adminRoutes.js");
const app = express();
app.use(express.json());
app.use("/api/admin", adminRouter);

describe("admin routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        findAdmin.mockResolvedValue({ user_id: 1, privilege: 1, is_active: 1 });
    });

    test("rejects a member with a non-admin database privilege", async () => {
        findAdmin.mockResolvedValue({ user_id: 1, privilege: 2, is_active: 1 });
        const response = await request(app).get("/api/admin/overview");
        expect(response.status).toBe(403);
        expect(users.findAll).not.toHaveBeenCalled();
    });

    test("overview selects public user fields and all resources", async () => {
        users.findAll.mockResolvedValue([{ user_id: 1, first_name: "Admin" }]);
        projects.findAll.mockResolvedValue([]);
        memberships.findAll.mockResolvedValue([]);
        tasks.findAll.mockResolvedValue([]);
        const response = await request(app).get("/api/admin/overview");
        expect(response.status).toBe(200);
        expect(response.body.users).toHaveLength(1);
        expect(users.findAll.mock.calls[0][0].attributes).not.toContain("hashed_password");
    });

    test("prevents an admin from removing their own privilege or account", async () => {
        const demotion = await request(app).patch("/api/admin/users/1").send({ privilege: 2 });
        const removal = await request(app).delete("/api/admin/users/1");
        expect(demotion.status).toBe(400);
        expect(removal.status).toBe(400);
    });

    test("requires assigned tasks to be moved before project membership removal", async () => {
        tasks.count.mockResolvedValue(1);
        const response = await request(app).delete("/api/admin/projects/2/members/3");
        expect(response.status).toBe(409);
        expect(memberships.destroy).not.toHaveBeenCalled();
    });

    test("adds a selected active member to a project", async () => {
        projects.findByPk.mockResolvedValue({ project_id: 2 });
        users.findOne.mockResolvedValue({ user_id: 3, is_active: 1 });
        memberships.findOne.mockResolvedValue(null);
        const response = await request(app).post("/api/admin/projects/2/members").send({ member_id: 3 });
        expect(response.status).toBe(201);
        expect(memberships.create).toHaveBeenCalledWith({ project_id: 2, user_id: 3 });
    });

    test("creating an admin task records its creation", async () => {
        tasks.create.mockResolvedValue({ task_id: 8 });
        const response = await request(app).post("/api/admin/tasks").send({ task_heading: "Plan work" });
        expect(response.status).toBe(201);
        expect(createEvent).toHaveBeenCalledWith({
            task_id: 8, user_id: 1, log_description: "Task created.", hours_logged: 0
        }, { transaction: {} });
    });
});
