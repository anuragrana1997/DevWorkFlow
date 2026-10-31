import { addMemberToProjectService, changeProjectStatusService, createProjectService, getProjectService } from "../services/projectService.js";
import { checkRequiredFields } from "../common/requiredFields.js";

export const getProjects = async (req, res) => {
    try {
        const response = await getProjectService(req.body);
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
        const response = await createProjectService(req.body)
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