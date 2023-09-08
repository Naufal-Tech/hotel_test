"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class hotel_kamar extends Model {
    static associate(models) {
      // Define association here
      hotel_kamar.hasMany(models.Booking, { foreignKey: "kamar_id" });
    }
  }

  hotel_kamar.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      hotel_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Hotel",
          key: "id",
        },
      },
      name_kamar: DataTypes.STRING,
      nomor_kamar: DataTypes.NUMERIC,
      harga: DataTypes.NUMERIC,
      deskripsi: DataTypes.STRING,

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
      modelName: "hotel_kamar",
      tableName: "hotel_kamar",
      timestamps: false,
    }
  );

  return hotel_kamar;
};
