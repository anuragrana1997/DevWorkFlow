import { DataTypes } from "sequelize";
import dbSequelize from "../config/Sequelize.js";

const Comment = dbSequelize.define(
    "Comment",
    {
        comment_id: {
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
        comment_description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "comments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Comment;