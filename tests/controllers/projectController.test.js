import { jest } from "@jest/globals";

const addMemberToProjectService = jest.fn();
const changeProjectStatusService = jest.fn();
const createProjectService = jest.fn();
const checkRequiredFields = jest.fn();

jest.unstable_mockModule("../services/projectService.js", () => ({
    addMemberToProjectService,
    changeProjectStatusService,
    createProjectService
}));

jest.unstable_mockModule("../common/requiredFields.js", () => ({ checkRequiredFields }));

const { addMemberToProject, createProject, changeProjectStatus } = await import("./projectController.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("projectController", () => {
    beforeEach(() => jest.clearAllMocks());

    test("addMemberToProject returns 201 on success", async () => {
        const req = { body: { user_id: 1, project_id: 2 } };
        const res = createResponse();
        addMemberToProjectService.mockResolvedValue({ project_id: 2, user_id: 1 });

        await addMemberToProject(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("addMemberToProject", req.body);
        expect(addMemberToProjectService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Member added to Project!" });
    });

    test("createProject returns project response", async () => {
        const req = { body: { project_name: "Jest project" } };
        const res = createResponse();
        const response = { project_id: 3, project_name: "Jest project" };
        createProjectService.mockResolvedValue(response);

        await createProject(req, res);

        expect(createProjectService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Success", response });
    });

    test("changeProjectStatus returns updated row count", async () => {
        const req = { body: { project_id: 3, project_status: 1 } };
        const res = createResponse();
        changeProjectStatusService.mockResolvedValue([1]);

        await changeProjectStatus(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("changeProjectStatus", req.body);
        expect(changeProjectStatusService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Success", updatedRows: 1 });
    });

    test("changeProjectStatus returns 401 when nothing is updated", async () => {
        const req = { body: { project_id: 3, project_status: 1 } };
        const res = createResponse();
        changeProjectStatusService.mockResolvedValue([0]);

        await changeProjectStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unable to change Project Status!" });
    });
});
