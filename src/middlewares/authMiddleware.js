const jwt = require('jsonwebtoken');
const { User, Role } = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.userId,
            tenant_id: req.tenant._id,
            status: 'active'
        }).populate('role_id');

        if (!user) {
            return res.status(401).json({ error: 'Invalid authentication' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        // Allow super admin to bypass tenant checks
        if (req.user.role_id.name === 'super_admin') {
            return next();
        }

        // Existing role check logic
        if (!allowedRoles.includes(req.user.role_id.name)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };