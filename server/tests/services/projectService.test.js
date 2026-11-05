import { jest } from "@jest/globals";
import { Op } from "sequelize";

const memberFindAll = jest.fn();
const memberCreate = jest.fn();
const taskFindAll = jest.fn();
const projectFindAll = jest.fn();
const projectCreate = jest.fn();
const projectUpdate = jest.fn();

jest.unstable_mockModule("../../src/models/ProjectMembers.js", () => ({
    default: { findAll: memberFindAll, create: memberCreate }
}));
jest.unstable_mockModule("../../src/models/Task.js", () => ({
    default: { findAll: taskFindAll }
}));
jest.unstable_mockModule("../../src/models/Project.js", () => ({
    default: { findAll: projectFindAll, create: projectCreate, update: projectUpdate }
}));

const { getProjectService, createProjectService, updateProjectService, changeProjectStatusService } = await import("../../src/services/projectService.js");

describe("getProjectService", () => {
    beforeEach(() => jest.clearAllMocks());

    test("includes projects from memberships and assigned tasks without duplicates", async () => {
        memberFindAll.mockResolvedValue([{ project_id: 1 }, { project_id: 2 }]);
        taskFindAll.mockResolvedValue([{ project_id: 2 }, { project_id: 3 }, { project_id: null }]);
        projectFindAll.mockResolvedValue([{ project_id: 1 }, { project_id: 2 }, { project_id: 3 }]);

        const projects = await getProjectService({ user_id: 7 });

        expect(memberFindAll).toHaveBeenCalledWith({
            where: { user_id: 7 }, attributes: ["project_id"]
        });
        expect(taskFindAll).toHaveBeenCalledWith({
            where: { assignee_id: 7 }, attributes: ["project_id"]
        });
        expect(projectFindAll).toHaveBeenCalledWith({
            where: { project_id: { [Op.in]: [1, 2, 3] } },
            order: [["project_id", "ASC"]]
        });
        expect(projects).toHaveLength(3);
    });

    test("returns an empty list when the user has no projects or tasks", async () => {
        memberFindAll.mockResolvedValue([]);
        taskFindAll.mockResolvedValue([]);

        await expect(getProjectService({ user_id: 7 })).resolves.toEqual([]);
        expect(projectFindAll).not.toHaveBeenCalled();
    });

    test("creates a project and makes its creator a member", async () => {
        projectCreate.mockResolvedValue({ project_id: 4, project_name: "New project" });
        memberCreate.mockResolvedValue({});
        await createProjectService({ project_name: "New project", user_id: 7 });
        expect(projectCreate).toHaveBeenCalledWith({ project_name: "New project", project_status: 0 });
        expect(memberCreate).toHaveBeenCalledWith({ project_id: 4, user_id: 7 });
    });

    test("updates project name and numeric status separately", async () => {
        await updateProjectService({ project_id: 4, project_name: "Renamed" });
        await changeProjectStatusService({ project_id: 4, project_status: 0 });
        expect(projectUpdate).toHaveBeenNthCalledWith(1, { project_name: "Renamed" }, { where: { project_id: 4 } });
        expect(projectUpdate).toHaveBeenNthCalledWith(2, { project_status: 0 }, { where: { project_id: 4 } });
    });
});
