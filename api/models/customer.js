"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Customer.belongsToMany(models.Product, {
      //   through: models.customer_product,
      // });
    }
  }
  Customer.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,

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
      modelName: "Customer",
      tableName: "customer", // Set the table name to match your migration
      timestamps: false, // Disable timestamps as they are handled in the columns
      // email: false, // drop property email dari table (tapi hapus dulu email property-nya + harus alter true)
      // email: "email_user", // tapi harus alter true
      paranoid: true, // soft-delete dan harus alter true dan could using destory
      underscored: true,
    }
  );

  // Apply schema changes without data loss
  Customer.sync({ alter: true })
    .then(() => {
      console.log("Table Customer synchronized with schema");
    })
    .catch((error) => {
      console.error("Error synchronizing table Customer with schema:", error);
    });

  return Customer;
};
