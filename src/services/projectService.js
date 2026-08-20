import ProjectMembers from "../models/ProjectMembers.js";

export const addMemberToProjectService = async(data) => {
    const {project_id, user_id} = data;
    return await ProjectMembers.create({
        project_id,
        user_id
    });
};