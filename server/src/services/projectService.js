import ProjectMembers from "../models/ProjectMembers.js";
import Project from "../models/Project.js";

export const addMemberToProjectService = async(data) => {
    const {project_id, user_id} = data;
    return await ProjectMembers.create({
        project_id,
        user_id
    });
};

export const createProjectService = async(data) => {
    return await Project.create({ data });
}

export const changeProjectStatusService = async(data) => {
    return await Project.update(
        data,
        {
            where: { project_id: data.project_id }
        }
    );
}