import { jest } from "@jest/globals";

const create = jest.fn();
const findAll = jest.fn();
const update = jest.fn();
const findOne = jest.fn();
const memberFindOne = jest.fn();
const userFindByPk = jest.fn();

jest.unstable_mockModule("../../src/models/Task.js", () => ({
    default: { create, findAll, update, findOne }
}));
jest.unstable_mockModule("../../src/models/ProjectMembers.js", () => ({ default: { findOne: memberFindOne } }));
jest.unstable_mockModule("../../src/models/User.js", () => ({ default: { findByPk: userFindByPk } }));

const { createTaskService, getTaskService, getAllTaskService, updateTaskService } = await import("../../src/services/taskService.js");

describe("taskService", () => {
    beforeEach(() => jest.clearAllMocks());

    test("createTaskService delegates to Task.create", async () => {
        const data = { task_heading: "Test" };
        create.mockResolvedValue({ task_id: 1 });

        await createTaskService(data);

        expect(create).toHaveBeenCalledWith(data);
    });

    test("refuses to create a task in an unrelated project", async () => {
        memberFindOne.mockResolvedValue(null);
        findOne.mockResolvedValue(null);
        await expect(createTaskService({ task_heading: "Hidden", project_id: 4, assignee_id: 7 }))
            .rejects.toThrow("You do not have access to this project.");
        expect(create).not.toHaveBeenCalled();
    });

    test("requires a project before assigning a task to another member", async () => {
        userFindByPk.mockResolvedValue({ user_id: 8, is_active: 1 });
        await expect(createTaskService({ task_heading: "Review", requester_id: 7, assignee_id: 8, project_id: null }))
            .rejects.toThrow("Select a project");
        expect(create).not.toHaveBeenCalled();
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
                task_status: "open",
                task_priority: "high"
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

    test("getAllTaskService returns all assigned tasks when no limit is requested", async () => {
        findAll.mockResolvedValue([]);

        await getAllTaskService({ user_id: 7, order: "ASC" });

        expect(findAll).toHaveBeenCalledWith({
            where: { assignee_id: 7 },
            order: [["task_id", "ASC"]]
        });
    });

    test("updateTaskService restricts update by task and assignee", async () => {
        const data = { task_id: 3, user_id: 7, task_heading: "Updated" };
        update.mockResolvedValue([1]);

        await updateTaskService(data);

        expect(update).toHaveBeenCalledWith({ task_heading: "Updated" }, {
            where: { task_id: 3, assignee_id: 7 }
        });
    });
});
