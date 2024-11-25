 const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.session.token;
        if (!token) {
            return res.status(401).redirect('/auth/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).redirect('/auth/login');
    }
};

const isManager = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Managers only.' });
    }
};

module.exports = { auth, isManager };