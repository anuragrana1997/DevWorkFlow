import { jest } from "@jest/globals";
import { Op } from "sequelize";

const memberFindAll = jest.fn();
const taskFindAll = jest.fn();
const projectFindAll = jest.fn();

jest.unstable_mockModule("../../src/models/ProjectMembers.js", () => ({
    default: { findAll: memberFindAll }
}));
jest.unstable_mockModule("../../src/models/Task.js", () => ({
    default: { findAll: taskFindAll }
}));
jest.unstable_mockModule("../../src/models/Project.js", () => ({
    default: { findAll: projectFindAll }
}));

const { getProjectService } = await import("../../src/services/projectService.js");

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
});
