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
        },
        memberFlag: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    // 2. 修改模型，添加新字段
    User.sync({
        alter: true
    }).then(() => {
        console.log('Model synchronized successfully.');
    }).catch(err => {
        console.error('Error synchronizing model:', err);
    });
    return User;
};