"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salesData = [
      {
        id: uuidv4(),
        name: "John Doe",
        email: "john.doe@example.com",
        coupon: "john",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: "Jane Smith",
        email: "jane.smith@example.com",
        coupon: "jane",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Add more sales records as needed
    ];

    // Insert the sample data into the 'sales' table
    await queryInterface.bulkInsert("sales", salesData, {});

    // Log a message to indicate that the seeder ran successfully
    console.log("Seeder for sales executed successfully.");
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all records from the 'sales' table
    await queryInterface.bulkDelete("sales", null, {});

    // Log a message to indicate that the seeder was reverted successfully
    console.log("Seeder for sales reverted successfully.");
  },
};
