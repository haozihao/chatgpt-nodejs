module.exports = (sequelize, Sequelize) => {
    const Captcha = sequelize.define("captcha", {
        code: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
    });

    return Captcha;
};