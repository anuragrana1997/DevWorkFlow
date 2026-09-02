const requiredFields = {
    "updateUser": ["user_id"],
    "deleteUser": ["user_id"],
    "addMemberToProject": ["user_id", "project_id"],
    "createTask": ["task_heading"],
    "updateTask": ["task_id"],
    "createComment": ["comment_description"],
    "updateComment": ["user_id", "comment_id", "comment_description"],
}

const requiredFieldsDT = {
    "user_id": "number",
    "project_id": "number",
    "task_id": "number",
    "comment_id": "number",
    "task_heading": "string",
    "comment_description": "string"
}

export const checkRequiredFields = (apiName, data) => {
    mandateFields = requiredFields[apiName]
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