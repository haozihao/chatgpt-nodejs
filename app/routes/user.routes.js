module.exports = app => {
  const user = require("../controllers/user.controller.js");
  const rate = require("../core/rate.js");
  var router = require("express").Router();

  const rateLimit = require('express-rate-limit');

  // 创建一个速率限制器，限制每个用户名24小时内最多允许 5 次登录失败
  const loginLimiter = rateLimit({
    store: rate.getLoginFailuresStore(),
    windowMs: 24 * 60 * 60 * 1000, // 24小时
    max: 5, // 最多5次登录失败
    keyGenerator: (req) => req.body.username, // 使用用户名作为键
    message: (req, res) => {
      res.json({
        result: false,
        message: `用户 ${req.body.username} 登录失败次数过多，请24小时后再试。`
      })
      return `用户 ${req.body.username} 登录失败次数过多，请24小时后再试。`;
    },
  });

  router.post("/sendCaptcha", user.sendCaptcha);

  router.post("/addUser", user.create);

  router.post("/checkUser", loginLimiter, user.checkUser);


  app.use('/api/users', router);
};