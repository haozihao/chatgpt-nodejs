const db = require("../models");
const User = db.users;
const Captcha = db.captcha;
const Email = require("../services/email");
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const rate = require("../core/rate.js");

exports.sendCaptcha = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.send({
      result: false,
      message: "email不能为空!",
    });
    return;
  }

  const captchaData = await Captcha.findOne({
    where: {
      [Op.and]: [
        {
          email: req.body.email,
        },
        {
          createdAt: {
            [Op.gt]: new Date(new Date() - 2 * 60 * 1000),
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
  });

  if (captchaData) {
    res.send({
      result: false,
      message: "已发送过验证码，请两分钟后重试!",
    });
    return;
  }

  var code = Math.random().toString(10).slice(-6);

  Email.sendMail(code, req.body.email);

  Captcha.create({
    code: code,
    email: req.body.email,
  })
    .then((data) => {
      // res.send(data);
      res.send({
        result: true,
        message: "验证码发送成功!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};

// 加密
exports.bcryptPwd = async (req, res) => {
  // Validate request
  if (!req.body.password) {
    res.send({
      result: false,
      message: "password不能为空!",
    });
    return;
  }
  res.send({
    result: true,
    message: "加密成功!",
    password: bcrypt.hashSync(req.body.password, 10),
  });
};

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    res.send({
      result: false,
      message: "username和password不能为空!",
    });
    return;
  }

  if (!req.body.code) {
    res.send({
      result: false,
      message: "验证码不能为空!",
    });
    return;
  }

  const captchaData = await Captcha.findOne({
    where: {
      [Op.and]: [
        {
          email: req.body.username,
        },
        {
          createdAt: {
            [Op.gt]: new Date(new Date() - 2 * 60 * 1000),
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
  });
  if (!captchaData || captchaData.code !== req.body.code) {
    res.send({
      result: false,
      message: "验证码不正确或已过期!",
    });
    return;
  }

  //Check user is exist or not
  const userData = await User.findAll({
    where: {
      username: req.body.username,
    },
  });
  if (userData.length > 0) {
    res.send({
      result: false,
      message: "该邮箱已注册，请登录使用!",
    });
    return;
  }

  // Create a user
  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send({
        result: true,
        message: "用户注册成功!",
        user: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.checkUser = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "username和password不能为空!",
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
      username: user.username,
    },
  })
    .then(async (data) => {
      if (data.length > 0) {
        const cUser = data[0];
        if (bcrypt.compareSync(user.password, cUser.password)) {
          // 验证通过清除登录失败次数记录
          rate.getLoginFailuresStore().resetKey(user.username);

          if (!cUser.memberFlag && cUser.useAcount > 1) {
            return res.json({
              result: false,
              message: `用户 ${req.body.username} 的试用次数已用完。`,
            });
          }

          await User.update(
            { useAcount: cUser.useAcount + 1 },
            {
              where: {
                id: cUser.id,
              },
            }
          );

          res.json({
            result: true,
          });
        } else {
          res.json({
            result: false,
          });
        }
      } else {
        res.json({
          result: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};
