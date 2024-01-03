const rateLimit = require("express-rate-limit");
const MemoryStore = require("express-rate-limit").MemoryStore;
const db = require("../models");
const User = db.users;

//用户验证请求失败次数限制
// 创建一个内存存储器，用于存储登录失败次数
const loginFailuresStore = new MemoryStore({
  checkInterval: 60 * 60 * 1000, // 检查间隔为1小时
  max: 10, // 最多存储10个登录失败记录
});

// 创建一个速率限制器，限制每个用户名24小时内最多允许 5 次登录失败
const loginLimiter = rateLimit({
  store: loginFailuresStore,
  windowMs: 24 * 60 * 60 * 1000, // 24小时
  max: 10, // 最多10次登录失败（由于一次提问会请求两次用户验证，所以实际上是允许5次失败）
  keyGenerator: (req) => req.body.username, // 使用用户名作为键
  message: (req, res) => {
    res.json({
      result: false,
      message: `用户 ${req.body.username} 登录失败次数过多，请24小时后再试。`,
    });
    return `用户 ${req.body.username} 登录失败次数过多，请24小时后再试。`;
  },
});

exports.getLoginFailuresStore = () => {
  return loginFailuresStore;
};
exports.getLoginLimiter = () => {
  return loginLimiter;
};
