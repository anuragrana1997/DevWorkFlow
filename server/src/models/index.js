import User from "./User.js";
import Project from "./Project.js";
import Task from "./Task.js";
import Comment from "./Comment.js";
import ActivityLog from "./ActivityLog.js";

Project.hasMany(Task, {
    foreignKey: "project_id",
    as: "tasks"
});

Task.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project"
});

User.hasMany(Task, {
    foreignKey: "assignee_id",
    as: "tasks"
});

Task.belongsTo(User, {
    foreignKey: "assignee_id",
    as: "assignee"
});

User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "Comments"
});

Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Task.hasMany(Comment, {
    foreignKey: "task_id",
    as: "Comments"
});

Comment.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task"
});

User.hasMany(ActivityLog, {
    foreignKey: "user_id",
    as: "ActivityLogs"
});

ActivityLog.belongsTo(User, {
    foreignKey: "user_id",
    as: "assignee"
});

Task.hasMany(ActivityLog, {
    foreignKey: "task_id",
    as: "ActivityLogs"
});

ActivityLog.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task"
});

export {
    User,
    Project,
    Task,
    Comment,
    ActivityLog
};