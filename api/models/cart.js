"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cart.belongsToMany(models.Product, {
        through: models.cart_item,
      });
    }
  }
  cart.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      modelName: "cart",
    }
  );
  return cart;
};
