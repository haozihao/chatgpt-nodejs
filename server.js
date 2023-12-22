const express = require("express");
const cors = require("cors");
const mainConfig = require("./app/config/main.config.js");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

// 静态资源目录，用于访问上传的图片
app.use('/uploads', express.static('uploads'));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to bezkoder application."
  });
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/upload.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || mainConfig.port;
app.set('port', PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});