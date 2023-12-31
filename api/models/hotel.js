const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.hasMany(models.hotel_kamar, { foreignKey: "hotel_id" });
      Hotel.belongsToMany(models.User, {
        through: models.UserHotel,
        foreignKey: "hotel_id",
      });
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
      modelName: "Hotel",
      freezeTableName: true,
      tableName: "hotel",
      timestamps: false,
      deletedAt: "deleted_at",
      deletedBy: "deleted_by",
      restoredAt: "restored_at",
      paranoid: true,
      underscored: true,
    }
  );

  Hotel.sync({ alter: true }).then(() => {
    console.log("Table Hotel synchronized with schema");
  });

  return Hotel;
};
