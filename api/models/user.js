"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Booking, { foreignKey: "user_id" });
      User.hasOne(models.Biodata, {
        foreignKey: "created_by",
        as: "biodata",
      });
      User.belongsToMany(models.Hotel, {
        through: models.UserHotel,
        foreignKey: "user_id",
      });
      User.belongsToMany(models.User, {
        as: "user",
        through: models.Follow,
        foreignKey: "user_id",
      });
      User.belongsToMany(models.User, {
        as: "friends",
        through: models.Follow,
        foreignKey: "friends_id",
      });
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
      nama: {
        type: DataTypes.STRING,
        get() {
          // ngembaliin first character of nama is always uppercase (di db bisa jadi lowercase)
          // manipulate the response
          const name = this.getDataValue("nama");
          return name.charAt(0).toUpperCase() + name.slice(1);
        },
        set(value) {
          // convert otomatis the first character of nama is always uppercase, write ke db
          // manipulate first and write to the database (like hashing password before saving to the db)
          this.setDataValue(
            "nama",
            value.charAt(0).toUpperCase() + value.slice(1)
          );
        },
      },
      no_hp: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
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
      updated_by: {
        type: DataTypes.STRING, // Match the data type of the User's id
        // references: {
        //   model: User, // Reference the User model itself
        //   key: "id", // Reference the 'id' column
        // },
      },
      deleted_by: {
        type: DataTypes.STRING, // Match the data type of the User's id
        // references: {
        //   model: User, // Reference the User model itself
        //   key: "id", // Reference the 'id' column
        // },
      },
    },
    {
      sequelize,
      freezeTableName: true, // matching the name of table without s
      modelName: "User",
      tableName: "user", // Set the table name to match your migration
      timestamps: false, // Disable timestamps as they are handled in the columns
      // email: false, // drop property email dari table (tapi hapus dulu email property-nya + harus alter true)
      // email: "email_user", // tapi harus alter true
      paranoid: true, // soft-delete dan harus alter true dan could using destory
      underscored: true,
    }
  );

  // Apply schema changes without data loss
  User.sync({ alter: true }).then(() => {
    console.log("Table synchronized with schema");
  });

  // DROP DB and Recreated Again (DONT DO THIS)
  // User.sync({ force: true }).then(() => {
  //   console.log("Force table User synchronized with schema");
  // });

  return User;
};
