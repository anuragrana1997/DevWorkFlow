import { jest } from "@jest/globals";

const hash = jest.fn();
const compare = jest.fn();
const findOne = jest.fn();
const create = jest.fn();
const createJwT = jest.fn();

jest.unstable_mockModule("bcrypt", () => ({
    default: { hash, compare }
}));

jest.unstable_mockModule("../models/User.js", () => ({
    default: { findOne, create }
}));

jest.unstable_mockModule("../middleware/authenticateMiddleware.js", () => ({
    createJwT
}));

const { registerUserService, loginUserService } = await import("./authenticationService.js");

describe("authenticationService", () => {
    beforeEach(() => jest.clearAllMocks());

    test("registerUserService rejects duplicate email", async () => {
        findOne.mockResolvedValue({ user_id: 1 });

        await expect(registerUserService({
            first_name: "A",
            last_name: "R",
            email: "a@example.com",
            password: "secret"
        })).rejects.toThrow("User already Exist");

        expect(create).not.toHaveBeenCalled();
    });

    test("registerUserService hashes password and returns safe user fields", async () => {
        findOne.mockResolvedValue(null);
        hash.mockResolvedValue("hashed-password");
        create.mockResolvedValue({
            user_id: 10,
            first_name: "Anurag",
            last_name: "Rana",
            email: "anurag@example.com",
            hashed_password: "hashed-password"
        });

        const result = await registerUserService({
            first_name: "Anurag",
            last_name: "Rana",
            email: "anurag@example.com",
            password: "secret123"
        });

        expect(hash).toHaveBeenCalledWith("secret123", 10);
        expect(create).toHaveBeenCalledWith({
            first_name: "Anurag",
            last_name: "Rana",
            email: "anurag@example.com",
            hashed_password: "hashed-password"
        });
        expect(result).toEqual({
            user_id: 10,
            first_name: "Anurag",
            last_name: "Rana",
            email: "anurag@example.com"
        });
    });

    test("loginUserService rejects an unknown user", async () => {
        findOne.mockResolvedValue(null);

        await expect(loginUserService({
            email: "missing@example.com",
            password: "secret"
        })).rejects.toThrow("User Doesn't Exist");
    });

    test("loginUserService rejects an incorrect password", async () => {
        findOne.mockResolvedValue({ hashed_password: "stored-hash" });
        compare.mockResolvedValue(false);

        await expect(loginUserService({
            email: "a@example.com",
            password: "wrong"
        })).rejects.toThrow("Password Incorrect");
    });

    test("loginUserService returns JWT for valid credentials", async () => {
        const user = { user_id: 3, privilege: 1, hashed_password: "stored-hash" };
        findOne.mockResolvedValue(user);
        compare.mockResolvedValue(true);
        createJwT.mockResolvedValue("jwt-token");

        const token = await loginUserService({
            email: "a@example.com",
            password: "correct"
        });

        expect(compare).toHaveBeenCalledWith("correct", "stored-hash");
        expect(createJwT).toHaveBeenCalledWith(user);
        expect(token).toBe("jwt-token");
    });
});
