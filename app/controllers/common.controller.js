const textFilter = require("../services/textFilter/ToolGood.Words.WordsSearch");
const fs = require('fs');
const path = require('path');

//读取敏感词库
const filePath = path.join(__dirname, '..', 'public', 'sensitive_words.txt');
const data = fs.readFileSync(filePath, 'utf8');
//初始化文本检测对象
const search = new textFilter.WordsSearch(); 
search.SetKeywords(data.split("、"));

exports.auditText = async (req, res) => {
  try {
    if (!req.body.content) {
      res.send({
        result: false,
        message: "审核文本不能为空",
      });
      return;
    }
    //待审核文本
    const content = req.body.content;

    // 检查是否有匹配
    var isContain = search.ContainsAny(content);

    if (isContain) {
      // 查找所有匹配
      var all = search.FindAll(content);
      res.send({
        result: false,
        message: "审核不通过",
        data: all,
      });
    } else {
      res.send({
        result: true,
        message: "审核通过",
      });
    }

  } catch (error) {
    console.error(error);
    res.send({
      result: false,
      message: "审核异常： " + JSON.stringify(error),
    });
    return;
  }
};
