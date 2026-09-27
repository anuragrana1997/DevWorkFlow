import { jest } from "@jest/globals";

const deleteUserService = jest.fn();
const getUserDetailsService = jest.fn();
const updateUserService = jest.fn();
const checkRequiredFields = jest.fn();

jest.unstable_mockModule("../../src/services/userService.js", () => ({
    deleteUserService,
    getUserDetailsService,
    updateUserService
}));

jest.unstable_mockModule("../../src/common/requiredFields.js", () => ({ checkRequiredFields }));

const { getUserDetails, updateUserDetails, deleteUser } = await import("../../src/controllers/userController.js");

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe("userController", () => {
    beforeEach(() => jest.clearAllMocks());

    test("getUserDetails fetches the authenticated user", async () => {
        const req = { params: {}, user: { user_id: 5 } };
        const res = createResponse();
        const userDetails = { user_id: 5, first_name: "Anurag" };
        getUserDetailsService.mockResolvedValue(userDetails);

        await getUserDetails(req, res);

        expect(getUserDetailsService).toHaveBeenCalledWith({ user_id: 5 });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ userDetails });
    });

    test("getUserDetails uses the route id when provided", async () => {
        const req = { params: { id: 9 }, user: { user_id: 5 } };
        const res = createResponse();
        getUserDetailsService.mockResolvedValue({ user_id: 9 });

        await getUserDetails(req, res);

        expect(getUserDetailsService).toHaveBeenCalledWith({ user_id: 9 });
    });

    test("updateUserDetails returns the number of updated rows", async () => {
        const req = { body: { user_id: 5, first_name: "Updated" } };
        const res = createResponse();
        updateUserService.mockResolvedValue([1]);

        await updateUserDetails(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("updateUser", req.body);
        expect(updateUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Update Success",
            numberOfUpdates: 1
        });
    });

    test("updateUserDetails returns 401 when user is not found", async () => {
        const req = { body: { user_id: 5 } };
        const res = createResponse();
        updateUserService.mockResolvedValue([0]);

        await updateUserDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    test("deleteUser returns 201 after soft delete", async () => {
        const req = { body: { user_id: 5 } };
        const res = createResponse();
        deleteUserService.mockResolvedValue([1]);

        await deleteUser(req, res);

        expect(checkRequiredFields).toHaveBeenCalledWith("deleteUser", req.body);
        expect(deleteUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "User removed from system" });
    });
});
