module.exports = (sequelize, DataTypes) => {

    const Messages = sequelize.define("Messages", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    })
    return Messages
}