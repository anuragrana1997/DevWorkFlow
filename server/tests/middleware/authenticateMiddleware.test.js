import { jest } from "@jest/globals";

const sign = jest.fn();
const verify = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: { sign, verify }
}));

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

    test("verifyJwt returns 401 when authorization header is missing", () => {
        const req = { headers: {} };
        const res = createResponse();
        const next = jest.fn();

        verifyJwt(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Token Required!" });
        expect(next).not.toHaveBeenCalled();
    });

    test("verifyJwt stores decoded token and calls next", () => {
        const req = { headers: { authorization: "Bearer abc123" } };
        const res = createResponse();
        const next = jest.fn();
        const decoded = { user_id: 5, privilege: 1 };
        verify.mockReturnValue(decoded);

        verifyJwt(req, res, next);

        expect(verify).toHaveBeenCalledWith("abc123", "test-secret");
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test("verifyJwt returns 401 for invalid token", () => {
        const req = { headers: { authorization: "Bearer invalid" } };
        const res = createResponse();
        const next = jest.fn();
        verify.mockImplementation(() => {
            throw new Error("invalid token");
        });

        verifyJwt(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired Token" });
        expect(next).not.toHaveBeenCalled();
    });
});
