import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const task = { findByPk: jest.fn() };
const user = { findByPk: jest.fn(), findAll: jest.fn() };
const member = { findOne: jest.fn() };
const activity = { findAll: jest.fn(), create: jest.fn() };
jest.unstable_mockModule("../../src/middleware/authenticateMiddleware.js", () => ({
    verifyJwt: (req, _res, next) => { req.user = { user_id: 7 }; next(); }
}));
jest.unstable_mockModule("../../src/models/index.js", () => ({
    User: user, Task: task, ProjectMembers: member, ActivityLog: activity
}));
const { default: historyRouter } = await import("../../src/routes/taskHistoryRoutes.js");
const app = express();
app.use(express.json());
app.use("/api/task", historyRouter);

describe("task history", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        user.findByPk.mockResolvedValue({ user_id: 7, privilege: 2, is_active: 1 });
    });

    test("denies history for a task outside the user's projects", async () => {
        task.findByPk.mockResolvedValue({ task_id: 2, project_id: 3, assignee_id: 8 });
        member.findOne.mockResolvedValue(null);
        const response = await request(app).get("/api/task/2/history");
        expect(response.status).toBe(403);
        expect(activity.findAll).not.toHaveBeenCalled();
    });

    test("returns task activity with author names for the assignee", async () => {
        task.findByPk.mockResolvedValue({ task_id: 2, project_id: null, assignee_id: 7 });
        activity.findAll.mockResolvedValue([{ user_id: 7, toJSON: () => ({ log_id: 10, user_id: 7, log_description: "Worked on it" }) }]);
        user.findAll.mockResolvedValue([{ user_id: 7, first_name: "A", last_name: "Member" }]);
        const response = await request(app).get("/api/task/2/history");
        expect(response.status).toBe(200);
        expect(response.body.logs[0].author_name).toBe("A Member");
    });

    test("adds activity to a task the user can access", async () => {
        task.findByPk.mockResolvedValue({ task_id: 2, project_id: null, assignee_id: 7 });
        activity.create.mockResolvedValue({
            toJSON: () => ({ log_id: 11, task_id: 2, user_id: 7, log_description: "Reviewed changes", hours_logged: 2 })
        });
        user.findByPk.mockResolvedValue({ user_id: 7, privilege: 2, is_active: 1, first_name: "A", last_name: "Member" });
        const response = await request(app).post("/api/task/2/activity").send({
            log_description: "  Reviewed changes  ", hours_logged: 2
        });
        expect(response.status).toBe(201);
        expect(activity.create).toHaveBeenCalledWith({
            task_id: 2, user_id: 7, log_description: "Reviewed changes", hours_logged: 2
        });
        expect(response.body.log.author_name).toBe("A Member");
    });

    test("rejects empty activity before writing", async () => {
        const response = await request(app).post("/api/task/2/activity").send({ log_description: "  " });
        expect(response.status).toBe(400);
        expect(activity.create).not.toHaveBeenCalled();
    });
});
