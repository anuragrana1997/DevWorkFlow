import { DataTypes } from "sequelize";
import dbSequelize from "../config/Sequelize.js";

const User = dbSequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hashed_password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        privilege: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default User;