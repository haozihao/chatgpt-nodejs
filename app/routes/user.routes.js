module.exports = app => {
  const user = require("../controllers/user.controller.js");
  const rate = require("../core/rate.js");
  var router = require("express").Router();


  router.post("/sendCaptcha", user.sendCaptcha);

  router.post("/addUser", user.create);

  router.post("/bcryptPwd", user.bcryptPwd);

  router.post("/checkUser", rate.getLoginLimiter(), user.checkUser);


  app.use('/api/users', router);
};