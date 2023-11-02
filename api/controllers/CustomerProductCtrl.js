const { Customer, Product, Sequelize } = require("../models");
const { Op } = require("sequelize");

const CustomerProductController = {
  create: async function (req, res) {
    try {
      const { customerId, productIds } = req.body;

      // Find the customer by ID
      const customer = await Customer.findByPk(customerId);
      console.log("🚀 ~ file: CustomerProductCtrl.js:11 ~ customer:", customer);

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // Find the products by their IDs
      const products = await Product.findAll({
        where: {
          id: productIds,
        },
      });

      if (products.length !== productIds.length) {
        return res
          .status(404)
          .json({ error: "One or more products not found" });
      }

      // Add products to the customer's association
      await customer.addProducts(products);

      return res
        .status(200)
        .json({ message: "Relationship created successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the relationship" });
    }
  },
};

module.exports = CustomerProductController;
