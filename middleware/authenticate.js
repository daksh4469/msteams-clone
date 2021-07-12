const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        res.status(401).json({
            msg: 'Unauthorized Department',
        });
    }

    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWTSECRET);

        // Add User from Payload
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({
            msg: 'Please login to view this page...',
        });
    }
}

module.exports = authenticateToken;
