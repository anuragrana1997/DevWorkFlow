import { addMemberToProjectService, changeProjectStatusService, createProjectService, getProjectService, updateProjectService } from "../services/projectService.js";
import { checkRequiredFields } from "../common/requiredFields.js";

export const getProjects = async (req, res) => {
    try {
        const response = await getProjectService({ user_id: req.user.user_id });
        if(!response) {
            throw new Error("Unable to fetch Projects for this user!")
        }
        return res.status(201).json({
            message: "Fetch Success",
            response
        })
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
}

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

export const createProject = async (req, res) => {
    try {
        checkRequiredFields("createProject", req.body)
        if (!req.body.project_name.trim()) return res.status(400).json({ message: "Project name cannot be empty." });
        const response = await createProjectService({ project_name: req.body.project_name.trim(), user_id: req.user.user_id })
        if(!response) {
            throw new Error("Project Creation Failed!");
        }
        return res.status(201).json({
            message: "Success",
            response
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};

export const changeProjectStatus = async (req, res) => {
    try {
        checkRequiredFields("changeProjectStatus" ,req.body)
        if (!Number.isInteger(req.body.project_status) || req.body.project_status < 0 || req.body.project_status > 2) {
            return res.status(400).json({ message: "Invalid project status." });
        }
        const [ updatedRows ] = await changeProjectStatusService(req.body);
        if(!updatedRows) {
            throw new Error("Unable to change Project Status!")
        }
        return res.status(201).json({
            message: "Success",
            updatedRows: updatedRows
        })
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
}

export const updateProject = async (req, res) => {
    try {
        checkRequiredFields("updateProject", req.body);
        if (!req.body.project_name.trim()) return res.status(400).json({ message: "Project name cannot be empty." });
        const [updatedRows] = await updateProjectService(req.body);
        if (!updatedRows) return res.status(404).json({ message: "Project not found." });
        return res.status(200).json({ message: "Project updated." });
    } catch (error) {
        return res.status(error.statusCode || 401).json({ message: error.message });
    }
};
