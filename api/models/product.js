"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.cart, {
        through: models.cart_item,
      });
    }
  }
  Product.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      productName: DataTypes.STRING,

      // CONFIG
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
      updated_by: {
        type: DataTypes.STRING, // Match the data type of the User's id
      },
      deleted_by: {
        type: DataTypes.STRING, // Match the data type of the User's id
      },
    },
    {
      sequelize,
      freezeTableName: true, // matching the name of table without s
      modelName: "Product",
      tableName: "product", // Set the table name to match your migration
      timestamps: false, // Disable timestamps as they are handled in the columns
      // email: false, // drop property email dari table (tapi hapus dulu email property-nya + harus alter true)
      // email: "email_user", // tapi harus alter true
      paranoid: true, // soft-delete dan harus alter true dan could using destory
      // underscored: true,
    }
  );

  // Apply schema changes without data loss
  Product.sync({ alter: true })
    .then(() => {
      console.log("Table Product synchronized with schema");
    })
    .catch((error) => {
      console.error("Error synchronizing Table Product with schema:", error);
    });

  // Product.sync({ force: true }).then(() => {
  //   console.log("Force table User synchronized with schema");
  // });

  return Product;
};
