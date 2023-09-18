"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: uuidv4(),
        nama: "Naufal",
        no_hp: "1234567890",
        alamat: "123 Main St",
        status: "owner",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "We",
        no_hp: "12345",
        alamat: "Jalan Street",
        status: "user",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "Deal",
        no_hp: "67890",
        alamat: "Jalan Jalan",
        status: "user",
        created_at: new Date(),
      },
      // Tambahakn di sini
    ];

    // Use queryInterface.bulkInsert to insert data into the "user" table
    await queryInterface.bulkInsert("user", users, {});

    // Log a message to indicate that the seeder ran successfully
    console.log("Seeder for user executed successfully.");
  },

  async down(queryInterface, Sequelize) {
    // Use queryInterface.bulkDelete to remove the inserted data if needed
    await queryInterface.bulkDelete("user", null, {});

    // Log a message to indicate that the seeder was reverted successfully
    console.log("Seeder for sales reverted successfully.");
  },
};
