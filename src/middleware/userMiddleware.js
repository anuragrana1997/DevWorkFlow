export const checkPrivilege = (req, res, next) => {
    try {
        if(req.user && req.user.privilege == 1) {
            req.access = true;
            return next();
        }
        throw new Error("Access Denied!");
    } catch (error) {
        return res.status(403).json({
            message: error.message
        });
    }
};