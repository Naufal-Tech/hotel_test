const { Product, Sequelize } = require("../models");
const { Op } = require("sequelize");

const ProductController = {
  create: async function (req, res) {
    try {
      // Parse the request body to get the data for the Biodata record
      const { productName } = req.body;

      // Create a new Biodata record
      const product = await Product.create({
        productName,
        created_at: new Date(),
        created_by: req.user.id,
      });

      return res.status(201).json(product); // Respond with the created Biodata record
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating Product" });
    }
  },
};

module.exports = ProductController;
