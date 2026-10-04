import { jest } from "@jest/globals";

const createTaskService = jest.fn();
const updateTaskService = jest.fn();
const getTaskService = jest.fn();
const getAllTaskService = jest.fn();
const checkRequiredFields = jest.fn();

jest.unstable_mockModule("../../src/services/taskService.js", () => ({
    createTaskService,
    updateTaskService,
    getTaskService,
    getAllTaskService
}));

jest.unstable_mockModule("../../src/common/requiredFields.js", () => ({
    checkRequiredFields
}));

const { createTask, getTask, getAllTask, updateTask } = await import("../../src/controllers/taskController.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("taskController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("createTask returns 201 when a task is created", async () => {
        const req = { body: { task_heading: "Write tests" } };
        const res = createResponse();
        const task = { task_id: 10, task_heading: "Write tests" };
        createTaskService.mockResolvedValue(task);

        await createTask(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("createTask", req.body);
        expect(createTaskService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Task Created!", task });
    });

    test("createTask returns 401 when service returns no task", async () => {
        const req = { body: { task_heading: "Write tests" } };
        const res = createResponse();
        createTaskService.mockResolvedValue(null);

        await createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Task creation failed!" });
    });

    test("getTask builds service input from user, params and query", async () => {
        const req = {
            body: {},
            user: { user_id: 1 },
            params: { id: 1 },
            query: { status: "open", priority: "high", order: "DESC", offset: 5, limit: 20 }
        };
        const res = createResponse();
        const task = [{ task_id: 1 }];
        getTaskService.mockResolvedValue(task);

        await getTask(req, res);

        expect(getTaskService).toHaveBeenCalledWith({
            user_id: 1,
            task_id: 1,
            status: "open",
            priority: "high",
            order: "DESC",
            offset: 5,
            limit: 20
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Tasks Found!", task });
    });

    test("getTask uses default pagination and ordering", async () => {
        const req = {
            body: {},
            user: { user_id: 1 },
            params: { id: 1 },
            query: {}
        };
        const res = createResponse();
        getTaskService.mockResolvedValue([]);

        await getTask(req, res);

        expect(getTaskService).toHaveBeenCalledWith({
            user_id: 1,
            task_id: 1,
            order: "ASC",
            offset: 0,
            limit: 10
        });
    });

    test("getAllTask returns service result", async () => {
        const req = {
            body: {},
            user: { user_id: 1 },
            query: { status: "open" }
        };
        const res = createResponse();
        const task = [{ task_id: 1 }];
        getAllTaskService.mockResolvedValue(task);

        await getAllTask(req, res);

        expect(getAllTaskService).toHaveBeenCalledWith({
            status: "open",
            order: "ASC",
            offset: 0,
            limit: 10,
            user_id: 1
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Tasks Found!", task });
    });

    test.skip("TODO: getAllTask should pass authenticated user_id to getAllTaskService", async () => {
        const req = { body: {}, user: { user_id: 1 }, query: {} };
        const res = createResponse();
        getAllTaskService.mockResolvedValue([]);

        await getAllTask(req, res);

        expect(getAllTaskService).toHaveBeenCalledWith(expect.objectContaining({ user_id: 7 }));
    });

    test("updateTask returns 201 when a row is updated", async () => {
        const req = {
            body: { task_id: 1, task_heading: "Updated" },
            user: { user_id: 1 }
        };
        const res = createResponse();
        updateTaskService.mockResolvedValue([1]);

        await updateTask(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("updateTask", {
            task_id: 1,
            task_heading: "Updated",
            user_id: 1
        });
        expect(updateTaskService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Task created successfully!" });
    });

    test("updateTask returns 401 when no row is updated", async () => {
        const req = { body: { task_id: 1 }, user: { user_id: 1 } };
        const res = createResponse();
        updateTaskService.mockResolvedValue([0]);

        await updateTask(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Task update Failed!" });
    });
});
