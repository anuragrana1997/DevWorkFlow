import { loginUserService, registerUserService } from "../services/authenticationService.js";

export const register = async (req, res) => {
    try {
        const user = await registerUserService(req.body);
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

export const login = async (req, res) => {
    try {
        const token = await loginUserService(req.body);
        return res.status(201).json({
            message: "Login Success",
            jwt_toke: token
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

