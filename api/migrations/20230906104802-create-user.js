"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4(),
      },
      nama: {
        type: Sequelize.STRING,
      },
      no_hp: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      alamat: {
        type: Sequelize.STRING,
      },
      sales_code: {
        type: Sequelize.STRING,
      },
      saldo: {
        type: Sequelize.NUMERIC, // Ensure this field is of the correct data type
      },
      user_commission: {
        type: Sequelize.NUMERIC,
      },
      owner_commission: {
        type: Sequelize.NUMERIC,
      },
      total_commission: {
        type: Sequelize.NUMERIC,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "user",
      },

      // CONFIG:
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      updated_by: {
        type: Sequelize.STRING, // Match the data type of the User's id
        references: {
          model: "user", // Reference the 'Users' table
          key: "id", // Reference the 'id' column
        },
      },
      deleted_by: {
        type: Sequelize.STRING, // Match the data type of the User's id
        references: {
          model: "user", // Reference the 'Users' table
          key: "id", // Reference the 'id' column
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
