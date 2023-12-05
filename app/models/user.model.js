module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        apiKey: {
            type: Sequelize.STRING
        },
        delFlag: {
            type: Sequelize.BOOLEAN
        }
    });

    return User;
};