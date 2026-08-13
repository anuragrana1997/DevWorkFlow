import { DataTypes, INTEGER } from "sequelize";
import dbSequelize from "../config/Sequelize.js";

const ActivityLog = dbSequelize.define(
    "ActivityLog",
    {
        log_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        task_id: {
            type: DataTypes.INTEGER
        },
        log_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        hours_logged: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        }
    },
    {
        tableName: "activity_log",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default ActivityLog;