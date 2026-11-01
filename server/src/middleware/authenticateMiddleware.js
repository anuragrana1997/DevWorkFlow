import jwt from "jsonwebtoken";

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

export const verifyJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                message: "Token Required!"
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedData;
        req.body ??= {};
        req.body.user_id = decodedData.user_id;
        // return res.status(201).json({
        //     message: "Token Verfied!",
        //     decodedData
        // });
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired Token"
        });
    }
}
