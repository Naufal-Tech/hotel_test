"use strict";
const { v4: uuidv4 } = require("uuid");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sales.hasMany(models.User, {
        foreignKey: "sales_code",
        as: "users",
      });
    }
  }
  Sales.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(), // generate uuid by default
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      coupon: DataTypes.STRING,
      total_commission: DataTypes.NUMERIC,
      sales_commission: DataTypes.NUMERIC,
      owner_commission: DataTypes.NUMERIC,

      // CONFIG:
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
    },
    {
      sequelize,
      modelName: "Sales",
      tableName: "sales",
      timestamps: false,
    }
  );
  return Sales;
};
