export const authDealerOrAdmin = (req, res, next) => {
    if (req.user.role === 'dealer' || req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Not authorized" });
    }
};