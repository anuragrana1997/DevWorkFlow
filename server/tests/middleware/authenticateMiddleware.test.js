import { jest } from "@jest/globals";

const sign = jest.fn();
const verify = jest.fn();
const findByPk = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: { sign, verify }
}));
jest.unstable_mockModule("../../src/models/User.js", () => ({ default: { findByPk } }));

const { createJwT, verifyJwt } = await import("../../src/middleware/authenticateMiddleware.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("authenticateMiddleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test-secret";
        process.env.JWT_EXPIRES_IN = "1h";
    });

    test("createJwT signs user id and privilege", async () => {
        sign.mockReturnValue("signed-token");

        const result = await createJwT({ user_id: 5, privilege: 1 });

        expect(sign).toHaveBeenCalledWith(
            { user_id: 5, privilege: 1 },
            "test-secret",
            { expiresIn: "1h" }
        );
        expect(result).toBe("signed-token");
    });

    test("verifyJwt returns 401 when authorization header is missing", async () => {
        const req = { headers: {} };
        const res = createResponse();
        const next = jest.fn();

        await verifyJwt(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Token Required!" });
        expect(next).not.toHaveBeenCalled();
    });

    test("verifyJwt loads current privilege and calls next", async () => {
        const req = { headers: { authorization: "Bearer abc123" } };
        const res = createResponse();
        const next = jest.fn();
        const decoded = { user_id: 5, privilege: 1 };
        verify.mockReturnValue(decoded);
        findByPk.mockResolvedValue({ user_id: 5, privilege: 2, is_active: 1 });

        await verifyJwt(req, res, next);

        expect(verify).toHaveBeenCalledWith("abc123", "test-secret");
        expect(req.user).toEqual({ user_id: 5, privilege: 2 });
        expect(next).toHaveBeenCalledTimes(1);
    });

    test("verifyJwt returns 401 for invalid token", async () => {
        const req = { headers: { authorization: "Bearer invalid" } };
        const res = createResponse();
        const next = jest.fn();
        verify.mockImplementation(() => {
            throw new Error("invalid token");
        });

        await verifyJwt(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired Token" });
        expect(next).not.toHaveBeenCalled();
    });

    test("verifyJwt rejects a removed member's existing token", async () => {
        const req = { headers: { authorization: "Bearer abc123" } };
        const res = createResponse();
        const next = jest.fn();
        verify.mockReturnValue({ user_id: 5, privilege: 1 });
        findByPk.mockResolvedValue({ user_id: 5, privilege: 1, is_active: 0 });
        await verifyJwt(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
