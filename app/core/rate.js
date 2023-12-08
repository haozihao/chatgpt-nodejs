const rateLimit = require('express-rate-limit');
const MemoryStore = require('express-rate-limit').MemoryStore;

// 创建一个内存存储器，用于存储登录失败次数
const loginFailuresStore = new MemoryStore({
  checkInterval: 60 * 60 * 1000, // 检查间隔为1小时
  max: 5, // 最多存储5个登录失败记录
});


exports.getLoginFailuresStore = () => {
  return loginFailuresStore
}