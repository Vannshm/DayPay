import jwt from 'jsonwebtoken';
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'Unautherised User Login First!'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECREAT_KEY);
        if (typeof decoded === 'string' || !('id' in decoded)) {
            return res.status(401).json({
                message: 'Invalid or Expired token!'
            });
        }
        req.user = { id: decoded.id };
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map