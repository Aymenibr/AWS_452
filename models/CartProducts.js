module.exports = (sequelize, DataTypes) => {
  const CartProducts = sequelize.define("CartProducts", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  CartProducts.associate = (models) => {
    CartProducts.belongsTo(models.Products, {
      foreignKey: "productId",
    });
    CartProducts.belongsTo(models.Carts, {
      foreignKey: "cartId",
    });
  };

  return CartProducts;
};
