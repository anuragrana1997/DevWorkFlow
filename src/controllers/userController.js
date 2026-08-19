import { getUserDetailsService } from "../services/userService.js";

export const getUserDetails = async(req, res) => {
    try {
        if(req.params.id) {
            req.user.user_id = req.params.id
        }
        const userDetails = await getUserDetailsService(req.user);
        return res.status(201).json({
            userDetails
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};