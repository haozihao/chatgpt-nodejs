const nodemailer = require('nodemailer')

//创建一个SMTP客户端配置对象
const transporter = nodemailer.createTransport({
    // 默认支持的邮箱服务包括：”QQ”、”163”、”126”、”iCloud”、”Hotmail”、”Yahoo”等
    service: "QQ",
    auth: {
        // 发件人邮箱账号
        user: '1362536356@qq.com',
        //发件人邮箱的授权码 需要在自己的邮箱设置中生成,并不是邮件的登录密码
        pass: 'xpfqhkrticceicge'
    }
})

// 配置收件人信息
const receiver = {
    // 发件人 邮箱  '昵称<发件人邮箱>'
    from: `"ChatGPT LINX"<1362536356@qq.com>`,
    // 主题
    subject: '注册请求',
    // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
    to: 'yexxxx@xxx.com',
    // 可以使用html标签
    html: `<h1>你好,你本次注册请求的验证码为,请尽快加入我们</h1>`
}



exports.sendMail = (code, mail) => {

    receiver.to = mail
    receiver.html = `<h1>您本次注册请求的验证码为:` + code +`,2分钟内有效</h1>`

    // 发送邮件 
    transporter.sendMail(receiver, (error, info) => {
        if (error) {
            return console.log('发送失败:', error);
        }
        console.log('发送成功:', info.response)
    })
}