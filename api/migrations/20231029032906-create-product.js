"use strict";
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        unique: true,
      },
      productName: {
        type: Sequelize.STRING,
      },
      // CONFIG:
      created_by: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "user", // Specify the model name (table name) here
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE, // Add this line to resolve deferred FK constraints
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      restored_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      updated_by: {
        type: Sequelize.STRING,
        references: {
          model: "user", // Specify the model name (table name) here
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE, // Add this line to resolve deferred FK constraints
        },
      },
      deleted_by: {
        type: Sequelize.STRING,
        references: {
          model: "user", // Specify the model name (table name) here
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE, // Add this line to resolve deferred FK constraints
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product");
  },
};
