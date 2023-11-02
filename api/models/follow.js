"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User, {
        as: "friends",
        foreignKey: "friends_id",
      });
      Follow.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
    }
  }
  Follow.init(
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      friends_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },

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
      freezeTableName: true,
      modelName: "Follow",
      tableName: "Follow",
      timestamps: false,
      underscored: true,
    }
  );

  // Apply schema changes without data loss
  //   Follow.sync({ alter: true }).then(() => {
  //     console.log("Table Follow synchronized with schema");
  //   });

  // DROP DB and Recreated Again (DONT DO THIS)
  //   Follow.sync({ force: true }).then(() => {
  //     console.log("Force table User synchronized with schema");
  //   });

  return Follow;
};
