const secretService = require("../services/secretKeySign");

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
    //固定参数
    const tenantId = "07";
    const businessId = "070001";
    const secretId = "zlqyt";
    const secretKey = "zlqyt";
    //校验参数
    const params = {
      secretId: secretId,
      nonce: 110,
      timestamp: Date.now(),
    };
    //sha256加密
    const signature = secretService.secretKeySign(params, secretKey);
    params.signature = signature;

    //发生请求参数
    const data = {
      content: content,
      tenantId: tenantId,
      businessId: businessId,
      params: params,
    };

    const result = await fetch(
      "https://saas.htsc.com.cn:1462/passport/audit/text",
      {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    const resJson = await result.json();
    if (resJson.data.results[0].suggestion === "Pass") {
      res.send({
        result: true,
        message: "审核通过",
        data: resJson,
      });
    } else {
      res.send({
        result: false,
        message: "审核不通过",
        data: resJson,
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
