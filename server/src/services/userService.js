import bcrypt from "bcrypt";
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

export const updateUserService = async(data) => {
    if(data.password) {
        data.hashed_password = await bcrypt.hash(data.password, 10);
        delete data.password;
    }
    return await User.update(
        data,
        {
            where: {user_id: data.user_id}
        }
    );
}

export const deleteUserService = async(data) => {
    return await User.update(
        { is_active: 0 },
        { where: { user_id: data.user_id }}
    );
};