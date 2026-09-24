import { jest } from "@jest/globals";

const hash = jest.fn();
const findOne = jest.fn();
const update = jest.fn();

jest.unstable_mockModule("bcrypt", () => ({
    default: { hash }
}));

jest.unstable_mockModule("../models/User.js", () => ({
    default: { findOne, update }
}));

const { getUserDetailsService, updateUserService, deleteUserService } = await import("./userService.js");

describe("userService", () => {
    beforeEach(() => jest.clearAllMocks());

    test("getUserDetailsService returns the requested user", async () => {
        const user = { user_id: 4, first_name: "Anurag" };
        findOne.mockResolvedValue(user);

        const result = await getUserDetailsService({ user_id: 4 });

        expect(findOne).toHaveBeenCalledWith({ where: { user_id: 4 } });
        expect(result).toBe(user);
    });

    test("getUserDetailsService throws when user is missing", async () => {
        findOne.mockResolvedValue(null);

        await expect(getUserDetailsService({ user_id: 4 })).rejects.toThrow("User Not Found!");
    });

    test("updateUserService hashes password before update", async () => {
        const data = { user_id: 4, password: "new-password" };
        hash.mockResolvedValue("new-hash");
        update.mockResolvedValue([1]);

        await updateUserService(data);

        expect(hash).toHaveBeenCalledWith("new-password", 10);
        expect(update).toHaveBeenCalledWith(
            { user_id: 4, hashed_password: "new-hash" },
            { where: { user_id: 4 } }
        );
    });

    test("deleteUserService performs a soft delete", async () => {
        update.mockResolvedValue([1]);

        await deleteUserService({ user_id: 4 });

        expect(update).toHaveBeenCalledWith(
            { is_active: 0 },
            { where: { user_id: 4 } }
        );
    });
});
