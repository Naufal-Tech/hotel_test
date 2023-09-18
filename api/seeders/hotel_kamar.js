"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate UUIDs for the hotel room records

    // Sample data for hotel rooms
    const hotelRooms = [
      {
        id: uuidv4(),
        hotel_id: "49ae802d-4aa7-47b0-b57e-8b99f2ed9e25", // Reference to an existing hotel's ID
        name_kamar: "Room A",
        nomor_kamar: 101,
        harga: 1000,
        deskripsi: "Standard Room",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        hotel_id: "78446b90-1fc9-4e44-8904-a3c65e550260", // Reference to an existing hotel's ID
        name_kamar: "Room B",
        nomor_kamar: 102,
        harga: 10000,
        deskripsi: "Deluxe Room",
        created_at: new Date(),
      },
      {
        id: uuidv4(),
        hotel_id: "b287586b-dc9e-420b-8498-655aa396b951", // Reference to an existing hotel's ID
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
