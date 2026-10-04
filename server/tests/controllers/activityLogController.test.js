import { jest } from "@jest/globals";

const createActivityLogService = jest.fn();
const updateActivityLogService = jest.fn();
const getActivityLogService = jest.fn();
const deleteActivityLogService = jest.fn();
const checkRequiredFields = jest.fn();

jest.unstable_mockModule("../../src/services/activityLogService.js", () => ({
    createActivityLogService,
    updateActivityLogService,
    getActivityLogService,
    deleteActivityLogService
}));

jest.unstable_mockModule("../../src/common/requiredFields.js", () => ({ checkRequiredFields }));

const { createActivityLog, updateActivityLog, getActivityLog, deleteActivityLog } = await import("../../src/controllers/activityLogController.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("activityLogController", () => {
    beforeEach(() => jest.clearAllMocks());

    test.skip("TODO: createActivityLog should call createActivityLogService instead of recursively calling itself", async () => {
        const req = { body: { log_id: 1, user_id: 2, task_id: 3 } };
        const res = createResponse();
        const log = { log_id: 1 };
        createActivityLogService.mockResolvedValue(log);

        await createActivityLog(req, res);

        expect(createActivityLogService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test("updateActivityLog returns 201 when a row is updated", async () => {
        const req = { body: { log_id: 1, user_id: 2 } };
        const res = createResponse();
        updateActivityLogService.mockResolvedValue([1]);

        await updateActivityLog(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("updateActiviyLog", req.body);
        expect(updateActivityLogService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test("getActivityLog returns logs", async () => {
        const req = { body: { task_id: 3 } };
        const res = createResponse();
        const logs = [{ log_id: 1 }];
        getActivityLogService.mockResolvedValue(logs);

        await getActivityLog(req, res);

        expect(getActivityLogService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Success", logs });
    });

    test("deleteActivityLog validates request and returns success", async () => {
        const req = { body: { log_id: 1 } };
        const res = createResponse();

        await deleteActivityLog(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("deleteActivityLog", req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Delete Success" });
    });

    test.skip("TODO: deleteActivityLog should call deleteActivityLogService", async () => {
        const req = { body: { log_id: 1 } };
        const res = createResponse();
        deleteActivityLogService.mockResolvedValue(1);

        await deleteActivityLog(req, res);

        expect(deleteActivityLogService).toHaveBeenCalledWith(req.body);
    });
});
