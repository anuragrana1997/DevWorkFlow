const requiredFields = {
    "register": ["email", "password", "first_name", "last_name"],
    "login": ["email", "password"],
    "updateUser": ["user_id"],
    "deleteUser": ["user_id"],
    "addMemberToProject": ["user_id", "project_id"],
    "createTask": ["task_heading"],
    "updateTask": ["task_id"],
    "createComment": ["task_id", "comment_description"],
    "updateComment": ["user_id", "comment_id", "comment_description"],
    "createProject": ["project_name"],
    "updateProject": ["project_id", "project_name"],
    "changeProjectStatus": ["project_id", "project_status"],
    "deleteComment": ["comment_id"],
    "createActivityLog": ["log_id", "user_id", "task_id"],
    "updateActiviyLog": ["log_id", "user_id"],
    "getActivityLog": ["task_id"],
    "deleteActivityLog": ["log_id"]
}

const requiredFieldsDT = {
    "user_id": "number",
    "project_id": "number",
    "task_id": "number",
    "comment_id": "number",
    "project_id": "number",
    "log_id": "number",
    "project_status": "number",
    "task_status": "number",
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string",
    "task_heading": "string",
    "comment_description": "string",
    "project_name": "string"
}

export const checkRequiredFields = (apiName, data) => {
    const mandateFields = requiredFields[apiName]
    for(const field of mandateFields) {
        if(!Object.hasOwn(data, field)) {
            const error = new Error(`${field} is required`)
            error.statusCode = 400
            throw error
        }
        if(typeof(data[field]) != requiredFieldsDT[field]) {
            const error = new Error(`${field} should be ${requiredFieldsDT[field]}`)
            error.statusCode = 400
            throw error
        }
    }
    return true
}
