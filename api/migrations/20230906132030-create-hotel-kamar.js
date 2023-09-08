"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hotel_kamar", {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4(),
      },
      hotel_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "hotel",
          key: "id",
        },
      },
      name_kamar: {
        type: Sequelize.STRING,
      },
      nomor_kamar: {
        type: Sequelize.NUMERIC,
      },
      harga: {
        type: Sequelize.NUMERIC,
      },
      deskripsi: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("hotel_kamar");
  },
};
