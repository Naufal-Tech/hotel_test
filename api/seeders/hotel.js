"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hotels = [
      {
        id: uuidv4(),
        nama: "Hotel A",
        alamat: "123 Main St, City A",
        no_hp: "+1234567890",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "Hotel B",
        alamat: "456 Elm St, City B",
        no_hp: "+9876543210",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        nama: "Hotel C",
        alamat: "789 Oak St, City C",
        no_hp: "+5555555555",
        created_at: new Date(),
      },
      // Tambahkan disini
    ];

    // Insert the sample data into the 'hotels' table
    await queryInterface.bulkInsert("hotel", hotels, {});

    // Log a message to indicate that the seeder ran successfully
    console.log("Seeder for hotels executed successfully.");
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all records from the 'hotels' table
    await queryInterface.bulkDelete("hotel", null, {});

    // Log a message to indicate that the seeder was reverted successfully
    console.log("Seeder for hotels reverted successfully.");
  },
};
