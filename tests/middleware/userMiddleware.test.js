import { jest } from "@jest/globals";
import { checkPrivilege } from "./userMiddleware.js";

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("checkPrivilege", () => {
    test("allows privilege 1 users", () => {
        const req = { user: { privilege: 1 } };
        const res = createResponse();
        const next = jest.fn();

        checkPrivilege(req, res, next);

        expect(req.access).toBe(true);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test("returns 403 when user is not privileged", () => {
        const req = { user: { privilege: 0 } };
        const res = createResponse();
        const next = jest.fn();

        checkPrivilege(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access Denied!" });
        expect(next).not.toHaveBeenCalled();
    });
});
