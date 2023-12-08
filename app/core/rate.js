const rateLimit = require('express-rate-limit');
const MemoryStore = require('express-rate-limit').MemoryStore;
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
      message: `用户 ${req.body.username} 登录失败次数过多，请24小时后再试。`
    })
    return `用户 ${req.body.username} 登录失败次数过多，请24小时后再试。`;
  },
});

exports.getLoginFailuresStore = () => {
  return loginFailuresStore
}
exports.getLoginLimiter = () => {
  return loginLimiter
}




//用户提问次数限制
// 创建一个内存存储器，用于存储提问次数
const requestStore = new MemoryStore({
  checkInterval: 60 * 60 * 1000, // 检查间隔为1小时
  max: 10, // 最多存储10个登录失败记录
});

// 创建一个速率限制器，限制每个用户名24小时内最多允许 5 次提问
const requestLimiter = rateLimit({
  store: requestStore,
  windowMs: 24 * 60 * 60 * 1000, // 24小时
  max: async (req) => {
    let max = 2
    // 根据不同用户返回不同的最大失败次数
    const username = req.body.username;
    //Check user is exist or not
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    if (user) {
      // 用户memberFlag为true时，访问次数为10（由于一次提问会请求两次，所以实际上是允许5次），否则为2
      max = user.memberFlag ? 10 : 2
    } else {
      max = 2
    }

    return max; 
  },
  keyGenerator: (req) => req.body.username, // 使用用户名作为键
  message: (req, res) => {
    res.json({
      result: false,
      message: `用户 ${req.body.username} 当日使用次数已用完，请24小时后再试。`
    })
    return `用户 ${req.body.username} 当日使用次数已用完，请24小时后再试。`;
  },
});

exports.getRequestStore = () => {
  return requestStore
}
exports.getRequestLimiter = () => {
  return requestLimiter
}