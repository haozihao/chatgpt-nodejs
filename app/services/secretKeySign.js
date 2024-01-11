const crypto = require("crypto");

const CHARSET = "utf-8";
const METHOD = "sha256";

const getStringToSign = (params) => {
  const s2s = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return s2s;
};

exports.secretKeySign = (params, secretKey) => {
  const s = getStringToSign(params);
  const hash = crypto
    .createHmac(METHOD, secretKey)
    .update(s, CHARSET)
    .digest("base64");
  return hash;
};
