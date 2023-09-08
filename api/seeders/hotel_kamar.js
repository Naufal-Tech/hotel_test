"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate UUIDs for the hotel room records

    // Sample data for hotel rooms
    const hotelRooms = [
      {
        id: uuidv4(),
        hotel_id: "1e313368-4a98-4564-a14a-166ec90176c8", // Reference to an existing hotel's ID
        name_kamar: "Room A",
        nomor_kamar: 101,
        harga: 1000,
        deskripsi: "Standard Room",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        hotel_id: "4b0edba0-ffbd-48e8-bea5-04d30e7e4676", // Reference to an existing hotel's ID
        name_kamar: "Room B",
        nomor_kamar: 102,
        harga: 10000,
        deskripsi: "Deluxe Room",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        hotel_id: "9bda45c5-f59a-4a8b-b05b-e8a58efda72d", // Reference to an existing hotel's ID
        name_kamar: "Room C",
        nomor_kamar: 103,
        harga: 100000,
        deskripsi: "Suite",
        created_at: new Date(),
      },
    ];

    // Insert the sample data into the 'hotel_kamar' table
    await queryInterface.bulkInsert("hotel_kamar", hotelRooms, {});

    // Log a message to indicate that the seeder ran successfully
    console.log("Seeder for hotel_kamar executed successfully.");
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all records from the 'hotel_kamar' table
    await queryInterface.bulkDelete("hotel_kamar", null, {});

    // Log a message to indicate that the seeder was reverted successfully
    console.log("Seeder for hotel_kamar reverted successfully.");
  },
};
