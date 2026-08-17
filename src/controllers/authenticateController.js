import { registerUser } from "../services/authenticationService.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        return res.status(201).json({
            message: "User successfully registered",
            user
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

