import bcrypt from "bcrypt";
import User from "../models/User.js";
import { createJwT } from "../middleware/authenticateMiddleware.js";

export const registerUserService = async (data) => {
    const { first_name, last_name, email, password } = data;

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

export const loginUserService = async (data) => {
    const { email, password } = data;
    const userData = await User.findOne({
        where: { email }
    });
    if(!userData) {
        throw new Error("User Doesn't Exist");
    }
    const isPasswordMatches = await bcrypt.compare(
        password,
        userData.hashed_password
    );
    if(!isPasswordMatches) {
        throw new Error("Password Incorrect");
    }
    const jwtToken = await createJwT(userData);
    return jwtToken;
}