"use strict";
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("biodata", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true,
        defaultValue: uuidv4(),
      },
      birthdate: {
        type: Sequelize.DATE,
      },
      self_description: {
        type: Sequelize.STRING,
      },
      hobbies: {
        type: Sequelize.STRING,
      },

      // CONFIG:
      created_by: {
        type: Sequelize.STRING,
        references: {
          model: "user", // Specify the model name (table name) here
          key: "id",
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
      },
      deleted_by: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("biodata");
  },
};
