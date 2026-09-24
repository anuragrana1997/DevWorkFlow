import { jest } from "@jest/globals";

const loginUserService = jest.fn();
const registerUserService = jest.fn();
const checkRequiredFields = jest.fn();

jest.unstable_mockModule("../services/authenticationService.js", () => ({
    loginUserService,
    registerUserService
}));

jest.unstable_mockModule("../common/requiredFields.js", () => ({
    checkRequiredFields
}));

const { register, login } = await import("./authenticateController.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("authenticateController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        test("returns 201 when registration succeeds", async () => {
            const req = {
                body: {
                    first_name: "Anurag",
                    last_name: "Rana",
                    email: "anurag@example.com",
                    password: "secret123"
                }
            };
            const res = createResponse();
            const user = {
                user_id: 1,
                first_name: "Anurag",
                last_name: "Rana",
                email: "anurag@example.com"
            };

            registerUserService.mockResolvedValue(user);

            await register(req, res);

            expect(checkRequiredFields).toHaveBeenCalledWith("register", req.body);
            expect(registerUserService).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User successfully registered",
                user
            });
        });

        test("returns 400 when registration fails", async () => {
            const req = { body: {} };
            const res = createResponse();
            registerUserService.mockRejectedValue(new Error("User already Exist"));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "User already Exist" });
        });
    });

    describe("login", () => {
        test("returns JWT token when login succeeds", async () => {
            const req = {
                body: {
                    email: "anurag@example.com",
                    password: "secret123"
                }
            };
            const res = createResponse();
            loginUserService.mockResolvedValue("jwt-token");

            await login(req, res);

            expect(checkRequiredFields).toHaveBeenCalledWith("login", req.body);
            expect(loginUserService).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login Success",
                jwt_token: "jwt-token"
            });
        });

        test("uses the error statusCode when login fails", async () => {
            const req = { body: { email: "x@example.com", password: "bad" } };
            const res = createResponse();
            const error = new Error("Password Incorrect");
            error.statusCode = 401;
            loginUserService.mockRejectedValue(error);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Password Incorrect" });
        });
    });
});
