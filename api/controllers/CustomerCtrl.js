const { Customer, Sequelize } = require("../models");
const { Op } = require("sequelize");

const CustomerController = {
  create: async function (req, res) {
    try {
      // Parse the request body to get the data for the Biodata record
      const { name, email } = req.body;

      // Create a new Biodata record
      const customer = await Customer.create({
        name,
        email,
        created_at: new Date(),
        created_by: req.user.id,
      });

      return res.status(201).json(customer); // Respond with the created Biodata record
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating Customer" });
    }
  },
};

module.exports = CustomerController;
