const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.hasMany(models.hotel_kamar, { foreignKey: "hotel_id" });
    }
  }

  Hotel.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      nama: DataTypes.STRING,
      alamat: DataTypes.STRING,
      no_hp: DataTypes.STRING,
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
      modelName: "Hotel",
      tableName: "hotel",
      timestamps: false,
    }
  );

  return Hotel;
};
