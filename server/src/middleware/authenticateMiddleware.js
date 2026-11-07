import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createJwT = async (userData) => {
    return jwt.sign(
        {
            user_id: userData.user_id,
            privilege: userData.privilege
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

export const verifyJwt = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                message: "Token Required!"
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findByPk(decodedData.user_id, { attributes: ["user_id", "privilege", "is_active"] });
        if (!currentUser || currentUser.is_active === 0) {
            return res.status(401).json({ message: "Account is inactive or unavailable." });
        }
        req.user = { user_id: currentUser.user_id, privilege: currentUser.privilege };
        req.body ??= {};
        req.body.user_id = decodedData.user_id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired Token"
        });
    }
}
