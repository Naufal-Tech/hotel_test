"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // Import the v4 function from uuid

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Define association here
      Booking.belongsTo(models.User, { foreignKey: "user_id" }); // checking user_id apakah exist di database User
      Booking.belongsTo(models.hotel_kamar, { foreignKey: "kamar_id" }); // checking kamar_id apakah exist di database User
    }
  }

  Booking.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kamar_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      harga_kamar: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      pendapatan_bersih: DataTypes.NUMERIC,
      pendapatan_sales: DataTypes.NUMERIC,
      sales_code: DataTypes.STRING,
      tanggal_check_in: DataTypes.DATE,
      tanggal_check_out: DataTypes.DATE,
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
      created_by: {
        type: DataTypes.STRING,
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
      modelName: "Booking",
      tableName: "booking", // Set the table name to match your migration
      timestamps: false, // Disable timestamps as they are handled in the columns
    }
  );

  return Booking;
};
