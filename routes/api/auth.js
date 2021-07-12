const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = require('../../middleware/authenticate');

const md5 = require('md5');

const User = require('../../models/User');

router.post('/', (req, res) => {
    let { email, password } = req.body;

    // Simple Validation
    if (!email || !password) {
        return res.status(400).json({
            msg: 'Please enter all fields',
        });
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist...kindly register first',
            });
        }

        password = md5(password);

        // Authenticate User
        if (password == user.password) {
            jwt.sign(
                { id: user.id },
                process.env.JWTSECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    return res.json({
                        token: token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                        },
                    });
                }
            );
        } else {
            return res.status(400).json({
                msg: 'Invalid Password!',
            });
        }
    });
});

router.post('/checktoken', authenticateToken, (req, res) => {
    return res.status(200).json(req.user);
});

router.get('/user', authenticateToken, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then((user) => res.json(user));
});

module.exports = router;
