import { DataTypes } from "sequelize";
import dbSequelize from "../config/Sequelize.js";

const Project = dbSequelize.define(
    "Project",
    {
        project_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        project_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        project_status: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        }
    },
    {
        tableName: "projects",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Project;