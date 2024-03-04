module.exports = (sequelize, DataTypes) => {
  //const Gatherings = require('./Gatherings');
  //const GatheringParticipants = require('./GatheringParticipants');
  const Users = sequelize.define("Users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });


    Users.associate = (models) => {
      Users.hasOne(models.Carts, {
        foreignKey: "userId",
      });
    };

    // Sequelize hook to create a cart for a new user
    Users.addHook('afterCreate', async (user, options) => {
        const Cart = sequelize.models.Carts;
        await Cart.create({ userId: user.id });
    });


  return Users;
};
