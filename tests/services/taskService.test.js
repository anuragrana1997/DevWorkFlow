import { jest } from "@jest/globals";

const create = jest.fn();
const findAll = jest.fn();
const update = jest.fn();

jest.unstable_mockModule("../models/Task.js", () => ({
    default: { create, findAll, update }
}));

const { createTaskService, getTaskService, getAllTaskService, updateTaskService } = await import("./taskService.js");

describe("taskService", () => {
    beforeEach(() => jest.clearAllMocks());

    test("createTaskService delegates to Task.create", async () => {
        const data = { task_heading: "Test" };
        create.mockResolvedValue({ task_id: 1 });

        await createTaskService(data);

        expect(create).toHaveBeenCalledWith({ data });
    });

    test("getTaskService builds filtered query", async () => {
        const data = {
            user_id: 7,
            task_id: 3,
            status: "open",
            priority: "high",
            order: "DESC",
            offset: 5,
            limit: 10
        };
        findAll.mockResolvedValue([]);

        await getTaskService(data);

        expect(findAll).toHaveBeenCalledWith({
            where: {
                assignee_id: 7,
                task_id: 3,
                status: "open",
                priority: "high"
            },
            order: [["task_id", "DESC"]],
            offset: 5,
            limit: 10
        });
    });

    test("getAllTaskService excludes optional filters when absent", async () => {
        const data = { user_id: 7, order: "ASC", offset: 0, limit: 10 };
        findAll.mockResolvedValue([]);

        await getAllTaskService(data);

        expect(findAll).toHaveBeenCalledWith({
            where: { assignee_id: 7 },
            order: [["task_id", "ASC"]],
            offset: 0,
            limit: 10
        });
    });

    test("updateTaskService restricts update by task and assignee", async () => {
        const data = { task_id: 3, user_id: 7, task_heading: "Updated" };
        update.mockResolvedValue([1]);

        await updateTaskService(data);

        expect(update).toHaveBeenCalledWith(data, {
            where: { task_id: 3, assignee_id: 7 }
        });
    });
});
