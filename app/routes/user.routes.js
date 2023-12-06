module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    router.post("/sendCaptcha", user.sendCaptcha);

    router.post("/addUser", user.create);
  
    router.post("/checkUser", user.checkUser);
    
  
    app.use('/api/users', router);
  };
  