import { addMemberToProjectService } from "../services/projectService.js";

export const addMemberToProject = async (req, res) => {
    try {
        const {user_id, project_id} = req.body;
        if(!user_id || !project_id) {
            throw new Error("user_id/project_id not found!");
        }
        const response = await addMemberToProjectService(req.body);
        if(!response) {
            throw new Error("Unable to add Member to project!");
        }

        return res.status(201).json({
            message: "Member added to Project!"
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};
