"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone"); // Import the moment-timezone library

module.exports = (sequelize, DataTypes) => {
  class Biodata extends Model {
    static associate(models) {
      Biodata.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "user",
      });
    }

    formatBirthdateToTimezone() {
      // Format the birthdate as "DD/MM/YYYY"
      if (this.birthdate) {
        return moment(this.birthdate).tz("Asia/Jakarta").format("DD/MM/YYYY");
      }
      return null;
    }
  }

  Biodata.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          // Getter function to format the date
          if (this.getDataValue("birthdate")) {
            return moment(this.getDataValue("birthdate"))
              .tz("Asia/Jakarta")
              .format("DD/MM/YYYY");
          }
          return null;
        },
        set(value) {
          // Setter function to parse and store the date
          if (value) {
            this.setDataValue(
              "birthdate",
              moment.tz(value, "DD/MM/YYYY", "Asia/Jakarta").toDate()
            );
          } else {
            this.setDataValue("birthdate", null);
          }
        },
      },
      self_description: DataTypes.STRING,
      hobbies: DataTypes.STRING,

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
      modelName: "Biodata",
      freezeTableName: true,
      tableName: "biodata",
      timestamps: false,
      deletedAt: "deleted_at",
      deletedBy: "deleted_by",
      restoredAt: "restored_at",
      paranoid: true,
      underscored: true,
    }
  );

  Biodata.sync({ alter: true }).then(() => {
    console.log("Table Biodata synchronized with schema");
  });

  return Biodata;
};
