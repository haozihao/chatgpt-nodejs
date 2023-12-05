const db = require("../models");
const User = db.users;
const bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: "username和password不能为空!"
        });
        return;
    }

    // Create a Tutorial
    const user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
    };

    // Save Tutorial in the database
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
    // Create a Tutorial
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
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};