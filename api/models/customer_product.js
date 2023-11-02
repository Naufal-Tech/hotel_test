"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customer_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer_product.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
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
      modelName: "customer_product",
      tableName: "customer_product", // Set the table name to match your migration
      timestamps: false, // Disable timestamps as they are handled in the columns
      // email: false, // drop property email dari table (tapi hapus dulu email property-nya + harus alter true)
      // email: "email_user", // tapi harus alter true
      paranoid: true, // soft-delete dan harus alter true dan could using destory
      underscored: true,
    }
  );

  // Apply schema changes without data loss
  customer_product
    .sync({ alter: true })
    .then(() => {
      console.log("Table Customer Product synchronized with schema");
    })
    .catch((error) => {
      console.error(
        "Error synchronizing table Customer Product with schema:",
        error
      );
    });

  return customer_product;
};
