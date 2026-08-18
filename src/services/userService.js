import User from "../models/User.js";

export const getUserDetailsService = async (data) => {
    const {user_id} = data;
    const userDetails = await User.findOne({
        where: { user_id }
    });
    if(!userDetails) {
        throw new Error("User Not Found!");
    }
    return userDetails;
}; 