module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", user.create);
  
    router.post("/checkUser", user.checkUser);
    
  
    app.use('/api/users', router);
  };
  