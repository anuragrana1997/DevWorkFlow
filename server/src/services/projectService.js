import ProjectMembers from "../models/ProjectMembers.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { Op } from "sequelize";

export const getProjectService = async(data) => {
    const { user_id } = data;
    const [memberships, assignedTasks] = await Promise.all([
        ProjectMembers.findAll({ where: { user_id }, attributes: ["project_id"] }),
        Task.findAll({ where: { assignee_id: user_id }, attributes: ["project_id"] })
    ]);
    const projectIds = [...new Set(
        [...memberships, ...assignedTasks]
            .map((item) => item.project_id)
            .filter((id) => id != null)
    )];
    if (projectIds.length === 0) return [];
    return await Project.findAll({
        where: { project_id: { [Op.in]: projectIds } },
        order: [["project_id", "ASC"]]
    });
}

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
