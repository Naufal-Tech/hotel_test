"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Booking, { foreignKey: "user_id" }); // user id dapat memiliki banyak booking id
    }
    // Hide ID:
    // toJSON() {
    //   return { ...this.get(), id: undefined };
    // }
  }

  User.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(), // generate uuid by default
      },
      nama: DataTypes.STRING,
      no_hp: {
        type: DataTypes.STRING,
        unique: true,
      },
      alamat: DataTypes.STRING,
      sales_code: DataTypes.STRING,
      saldo: DataTypes.NUMERIC,
      user_commission: DataTypes.NUMERIC,
      owner_commission: DataTypes.NUMERIC,
      total_commission: DataTypes.NUMERIC,
      status: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
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
        references: {
          model: "user", // Reference the 'User' model
          key: "id", // Reference the 'id' column
        },
      },
      deleted_by: {
        type: DataTypes.STRING, // Match the data type of the User's id
        references: {
          model: "user", // Reference the 'User' model
          key: "id", // Reference the 'id' column
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user", // Set the table name to match your migration
      timestamps: false, // Disable timestamps as they are handled in the columns
    }
  );

  return User;
};
