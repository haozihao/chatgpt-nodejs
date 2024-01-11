module.exports = app => {
  const common = require("../controllers/common.controller.js");

  var router = require("express").Router();

  
  router.post("/auditText", common.auditText);


  app.use('/api/common', router);
};
