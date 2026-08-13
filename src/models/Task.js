import { DataTypes } from "sequelize";
import dbSequelize from "../config/Sequelize.js";

const Task = dbSequelize.define(
    "Task",
    {
        task_id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        project_id: {
            type: DataTypes.INTEGER
        },
        assignee_id: {
            type: DataTypes.INTEGER
        },
        task_heading: {
            type: DataTypes.STRING,
            allowNull: false
        },
        task_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        task_status: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        }
    },
    {
        tableName: "tasks",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Task;