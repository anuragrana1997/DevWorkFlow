import { addMemberToProjectService } from "../services/projectService.js";
import { checkRequiredFields } from "../common/requiredFields.js";

export const addMemberToProject = async (req, res) => {
    try {
        checkRequiredFields("addMemberToProject", req.body)
        const response = await addMemberToProjectService(req.body);
        if(!response) {
            throw new Error("Unable to add Member to project!");
        }

        return res.status(201).json({
            message: "Member added to Project!"
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};
