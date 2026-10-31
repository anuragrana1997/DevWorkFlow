
import User from "./User.js";
import Project from "./Project.js";
import Task from "./Task.js";
import Comment from "./Comment.js";
import ActivityLog from "./ActivityLog.js";
import ProjectMembers from "./ProjectMembers.js";

// Project ↔ Task
Project.hasMany(Task, {
    foreignKey: "project_id",
    as: "tasks"
});

Task.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project"
});

// User ↔ Task
User.hasMany(Task, {
    foreignKey: "assignee_id",
    as: "tasks"
});

Task.belongsTo(User, {
    foreignKey: "assignee_id",
    as: "assignee"
});

// User ↔ Comment
User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "Comments"
});

Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

// Task ↔ Comment
Task.hasMany(Comment, {
    foreignKey: "task_id",
    as: "Comments"
});

Comment.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task"
});

// User ↔ ActivityLog
User.hasMany(ActivityLog, {
    foreignKey: "user_id",
    as: "ActivityLogs"
});

ActivityLog.belongsTo(User, {
    foreignKey: "user_id",
    as: "assignee"
});

// Task ↔ ActivityLog
Task.hasMany(ActivityLog, {
    foreignKey: "task_id",
    as: "ActivityLogs"
});

ActivityLog.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task"
});

// Project ↔ User (Many-to-Many)
Project.belongsToMany(User, {
    through: ProjectMembers,
    foreignKey: "project_id",
    otherKey: "user_id",
    as: "members"
});

User.belongsToMany(Project, {
    through: ProjectMembers,
    foreignKey: "user_id",
    otherKey: "project_id",
    as: "projects"
});

export {
    User,
    Project,
    Task,
    Comment,
    ActivityLog,
    ProjectMembers
};
