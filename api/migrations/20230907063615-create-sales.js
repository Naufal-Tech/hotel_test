"use strict";

const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales", {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4(),
      },
      name: {
        type: Sequelize.STRING,
      },
      coupon: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      total_commission: {
        type: Sequelize.NUMERIC,
      },
      sales_commission: {
        type: Sequelize.NUMERIC,
      },
      owner_commission: {
        type: Sequelize.NUMERIC,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sales");
  },
};
