const { cart, cart_item, Product, Sequelize } = require("../models");
const { Op } = require("sequelize");

const CartItemController = {
  create: async function (req, res) {
    try {
      const { productId, cartId, quantity } = req.body;

      // Find the product and cart by their IDs
      const product = await Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const carts = await cart.findOne({
        where: { id: cartId },
      });

      if (!carts) {
        return res.status(404).json({ error: "Cart not found" });
      }

      // Create a new CartItem and associate it with the product and cart
      const cartItem = await cart_item.create({ quantity });
      await carts.addProduct(product, { through: cart_item });

      return res
        .status(200)
        .json({ message: "CartItem created successfully", cartItem });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the CartItem" });
    }
  },
};

module.exports = CartItemController;
