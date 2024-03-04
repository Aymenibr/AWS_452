module.exports = (sequelize, DataTypes) => {
  const Carts = sequelize.define("Carts", {});

  Carts.associate = (models) => {
    Carts.belongsTo(models.Users, {
      foreignKey: "userId",
    });
  };

  return Carts;
};
