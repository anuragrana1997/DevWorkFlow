import { DataTypes } from "sequelize";
import dbSequelize from "../config/Sequelize.js";

const ProjectMembers = dbSequelize.define(
    "ProjectMembers",
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        project_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: "projectMembers",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default ProjectMembers;