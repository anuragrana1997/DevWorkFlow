import { loginUserService, registerUserService } from "../services/authenticationService.js";
import { checkRequiredFields } from "../common/requiredFields.js";


export const register = async (req, res) => {
    try {
        checkRequiredFields("register", req.body);
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
        checkRequiredFields("login", req.body);
        const token = await loginUserService(req.body);
        return res.status(201).json({
            message: "Login Success",
            jwt_token: token
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message
        });
    }
};

