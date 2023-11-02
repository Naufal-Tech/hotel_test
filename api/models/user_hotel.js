"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class UserHotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserHotel.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user", // Define an alias for the User association
      });

      UserHotel.belongsTo(models.Hotel, {
        foreignKey: "hotel_id",
        as: "hotel", // Define an alias for the Hotel association
      });
    }
  }
  UserHotel.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      user_id: DataTypes.STRING,
      hotel_id: DataTypes.STRING,

      // CONFIG
      created_by: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      restored_at: {
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
      updated_by: {
        type: DataTypes.STRING,
      },
      deleted_by: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "UserHotel",
      freezeTableName: true, // matching the name of table without s
      tableName: "user_hotel", // Set the table name to match your migration
      timestamps: false,
      paranoid: true,
      underscored: true,
    }
  );

  UserHotel.sync({ alter: true }).then(() => {
    console.log("Table User Hotel synchronized with schema");
  });

  return UserHotel;
};
