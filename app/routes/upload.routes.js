module.exports = (app) => {
  var router = require("express").Router();
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");
  const mainConfig = require("../config/main.config");

  const uploadDir = mainConfig.upload.path;

  // 检查目录是否存在，不存在则创建
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // 设置存储引擎和文件名
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // 存储目录，确保该目录存在
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  // 创建 multer 实例，设置存储引擎和文件大小限制（可选）
  const uploadMulter = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * mainConfig.upload.max, // 限制文件大小为10 MB
    },
  });

  router.post("/", uploadMulter.single("file"), (req, res) => {
    // req.file 包含上传的文件信息
    if (!req.file) {
      return res.send({
        result: false,
        message: "请上传文件!"
      });
    }
    const host = req.get("host");
    const imageUrl = `http://${host}/${req.file.path}`;

    // 返回成功的响应，包含图片地址
    res.send({
      result: true,
      message: "上传成功!",
      imageUrl: imageUrl,
    });
  });

  app.use("/api/upload", router);
};
