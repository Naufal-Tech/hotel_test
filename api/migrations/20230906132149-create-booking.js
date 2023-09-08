"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("booking", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: uuidv4(),
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      kamar_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "hotel_kamar",
          key: "id",
        },
      },
      harga_kamar: {
        type: Sequelize.NUMERIC,
        allowNull: false,
      },
      pendapatan_bersih: Sequelize.NUMERIC,
      pendapatan_sales: Sequelize.NUMERIC,
      sales_code: Sequelize.STRING,
      tanggal_check_in: Sequelize.DATE,
      tanggal_check_out: Sequelize.DATE,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
      created_by: Sequelize.STRING,
      updated_by: Sequelize.STRING,
      deleted_by: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("booking");
  },
};
