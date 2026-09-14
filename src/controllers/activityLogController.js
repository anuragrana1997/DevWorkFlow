import { checkRequiredFields } from "../common/requiredFields.js";
import { 
    createActivityLogService, 
    updateActivityLogService, 
    getActivityLogService, 
    deleteActivityLogService  
} from "../services/activityLogService.js";

export const createActivityLog = async( req, res ) => {
    try {
        checkRequiredFields("createActivityLog", req.body);
        const log = await createActivityLog(req.body);
        if(log) {
            return res.status(201).json({
                message: "Log Created!",
                log
            });
        } else {
            throw new Error("Unable to create Log!");
        }
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
}

export const updateActivityLog = async ( req, res ) => {
    try {
        checkRequiredFields("updateActiviyLog", req.body);
        const [ updatedRows ] = await updateActivityLogService(req.body);
        if(updatedRows) {
            return res.status(201).json({
                message: "Log Created!",
            })
        } else {
            throw new Error("Update Failed");
        }
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
}

export const getActivityLog = async ( req, res) => {
    try {
        checkRequiredFields("getActivityLog", req.body);
        const logs = await getActivityLogService(req.body);
        if( logs ) {
            return res.status(201).json({
                message: "Success",
                logs
            });
        } else {
            throw new Error("Logs Not Found!");
        }
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
}

export const deleteActivityLog = async ( req, res ) => {
    try {
        checkRequiredFields("deleteActivityLog", req.body);
        return res.status(201).json({
            message: "Delete Success"
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
}
