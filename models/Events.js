module.exports = (sequelize, DataTypes) => {

    const Events = sequelize.define("Events", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        
    })
    // Events.associate = (models) => {
    //     Events.hasMany(models.Posts, {
    //         onDelete: 'cascade',
    //     })
    // }
    return Events
}