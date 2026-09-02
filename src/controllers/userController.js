import { deleteUserService, getUserDetailsService, updateUserService } from "../services/userService.js";
import { checkRequiredFields } from "../common/requiredFields.js";

export const getUserDetails = async(req, res) => {
    try {
        if(req.params.id) {
            req.user.user_id = req.params.id
        }
        const userDetails = await getUserDetailsService(req.user);
        return res.status(201).json({
            userDetails
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};

export const updateUserDetails = async(req, res) => {
    try {
        checkRequiredFields("updateUser", req.body);
        const [updatedRows] = await updateUserService(req.body);
        if(updatedRows === 0) {
            throw new Error("User not found");
        }
        return res.status(201).json({
            message: "Update Success",
            numberOfUpdates: updatedRows
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};

export const deleteUser = async(req, res) => {
    try {
        checkRequiredFields("deleteUser", req.body);
        const [updatedRows] = await deleteUserService(req.body);
        if(updatedRows === 0) {
            throw new Error("Failed to delete user or user doesn't exist");
        }
        return res.status(201).json({
            message: "User removed from system"
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};