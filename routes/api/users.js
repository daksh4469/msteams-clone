const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
const md5 = require('md5');

const User = require('../../models/User');

router.post('/', (req, res) => {
    let { name, email, password } = req.body;

    // Simple Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            msg: 'Please enter all fields',
        });
    }

    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(400).json({
                msg: 'User with same email already exists...',
            });
        }

        password = md5(password);

        const newUser = new User({
            name,
            email,
            password,
        });

        newUser
            .save()
            .then((user) => {
                console.log(process.env.JWTSECRET);
                jwt.sign(
                    { id: user.id },
                    process.env.JWTSECRET,
                    { expiresIn: 1800 },
                    (err, token) => {
                        if (err) {
                            throw err;
                        }
                        res.json({
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
            })
            .catch((err) => {
                return res.status(400).json({
                    msg: 'Error occured while registering...',
                });
            });
    });
});

module.exports = router;
