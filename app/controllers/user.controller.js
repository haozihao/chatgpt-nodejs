const db = require("../models");
const User = db.users;
const Captcha = db.captcha;
const bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;

exports.sendCaptcha = (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: "email不能为空!"
        });
        return;
    }

    var code = Math.random().toString(10).slice(-6);

    Captcha.create({
            code: code,
            email: req.body.email
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });
};

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: "username和password不能为空!"
        });
        return;
    }

    //Check user is exist or not
    User.findAll({
        where: {
            username: req.body.username
        }
    }).then(data => {
        if (data.length > 0) {
            res.status(400).send({
                message: "该用户已注册，请登录使用!"
            });
        }
        return;
    })

    // Create a user
    const user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

exports.checkUser = (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: "username和password不能为空!"
        });
        return;
    }
    // Create a User
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    User.findAll({
            where: {
                username: user.username
            }
        })
        .then(data => {
            if (data.length > 0) {
                const cUser = data[0]
                if (bcrypt.compareSync(user.password, cUser.password)) {
                    res.json({
                        result: true
                    })
                } else {
                    res.json({
                        result: false
                    })
                }
            } else {
                res.json({
                    result: false
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            });
        });
};