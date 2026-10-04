import { jest } from "@jest/globals";

const createCommentService = jest.fn();
const getCommentService = jest.fn();
const updateCommentService = jest.fn();
const checkRequiredFields = jest.fn();

jest.unstable_mockModule("../../src/services/commentService.js", () => ({
    createCommentService,
    getCommentService,
    updateCommentService
}));

jest.unstable_mockModule("../../src/common/requiredFields.js", () => ({ checkRequiredFields }));

const { createComment, updateComment, getComment, deleteComment } = await import("../../src/controllers/commentController.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("commentController", () => {
    beforeEach(() => jest.clearAllMocks());

    test("createComment returns the created comment", async () => {
        const req = { body: { comment_description: "Looks good" } };
        const res = createResponse();
        const comment = { comment_id: 1, comment_description: "Looks good" };
        createCommentService.mockResolvedValue(comment);

        await createComment(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("createComment", req.body);
        expect(createCommentService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Comment Successful!", comment });
    });

    test("updateComment returns success when rows are updated", async () => {
        const req = { body: { user_id: 1, comment_id: 2, comment_description: "Updated" } };
        const res = createResponse();
        updateCommentService.mockResolvedValue([1]);

        await updateComment(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "update success" });
    });

    test("updateComment returns 401 when no row is updated", async () => {
        const req = { body: { user_id: 1, comment_id: 2, comment_description: "Updated" } };
        const res = createResponse();
        updateCommentService.mockResolvedValue([0]);

        await updateComment(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "update failed" });
    });

    test("getComment forwards query to service", async () => {
        const req = { query: { task_id: 10 } };
        const res = createResponse();
        const comments = [{ comment_id: 1 }];
        getCommentService.mockResolvedValue(comments);

        await getComment(req, res);

        expect(getCommentService).toHaveBeenCalledWith(req.query);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Fetch Success", comments });
    });

    test("deleteComment validates request and returns success", async () => {
        const req = { body: { comment_id: 2 } };
        const res = createResponse();

        await deleteComment(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("deleteComment", req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Delete Success" });
    });
});
