const { Sales } = require("../models");

const SalesController = {
  add: async function (req, res) {
    try {
      const { name, email, coupon } = req.body;

      const newSales = await Sales.create({
        name,
        email,
        coupon,
        created_at: new Date(),
      });

      res.status(201).json(newSales);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the sales record." });
    }
  },

  update: async function (req, res) {
    try {
      const { id, name, email, coupon } = req.body;

      const sales = await Sales.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!sales) {
        return res.status(404).json({ error: "Sales not found" });
      }

      sales.name = name;
      sales.email = email;
      sales.coupon = coupon;

      await sales.save();

      res.status(200).json({ sales });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the sales" });
    }
  },

  delete: async function (req, res) {
    try {
      const { id } = req.body;

      const sales = await Sales.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!sales) {
        return res.status(404).json({ error: "Sales not found" });
      }

      await sales.update({
        deleted_at: new Date(),
      });

      res.status(200).json({ message: "Sales soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while soft-deleting the Sales",
      });
    }
  },

  get: async function (req, res) {
    try {
      const sales = await Sales.findAll({
        where: { deleted_at: null },
      });

      res.status(200).json(sales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching sales" });
    }
  },

  detail: async function (req, res) {
    try {
      const { id } = req.params;

      const sales = await Sales.findOne({
        where: { id },
      });

      if (!sales) {
        return res.status(404).json({ error: "Sales not found" });
      }

      res.status(200).json(sales);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the Sales" });
    }
  },
};

module.exports = SalesController;
