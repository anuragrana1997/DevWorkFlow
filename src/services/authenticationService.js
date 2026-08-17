import bcrypt from "bcrypt";
import User from "../models/User.js"

export const registerUser = async (data) => {
    const { first_name, last_name, email, password } = data;

    if(!first_name || !last_name || !email || !password ) {
        throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({
        where: { email }
    });
    if(existingUser) {
        throw new Error("User already Exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        first_name,
        last_name,
        email,
        hashed_password : hashedPassword
    });

    return {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    }
};

