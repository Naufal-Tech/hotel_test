const { UserHotel, User, Hotel, Sequelize } = require("../models");
const { Op } = require("sequelize");

const UserHotelController = {
  create: async function (req, res) {
    try {
      console.log("user", req.user.id);
      const { hotel_id } = req.body; // Extract hotelId from the request body

      if (!hotel_id) {
        return res
          .status(400)
          .json({ error: "Missing hotelId in request body" });
      }

      const userHotel = await UserHotel.create({
        user_id: req.user.id,
        hotel_id: hotel_id,
        created_at: new Date(),
        created_by: req.user.id,
      });

      return res.status(201).json(userHotel);
    } catch (error) {
      return res.status(500).json({
        error: "Error creating User-Hotel relationship: " + error.message,
      });
    }
  },

  get: async function (req, res) {
    const userId = req.user.id;
    console.log("🚀 ~ file: UserHotelCtrl.js:31 ~ req.user.id:", req.user.id);
    console.log("🚀 ~ file: UserHotelCtrl.js:32 ~ userId:", userId);
    try {
      const userHotels = await UserHotel.findAll({
        where: { user_id: userId },
        include: [
          {
            model: User, // Include the User model
            as: "user", // Alias for the association
            attributes: ["id", "nama", "email", "alamat"],
          },
          {
            model: Hotel, // Include the Hotel model
            as: "hotel", // Alias for the association
            attributes: ["id", "nama", "alamat", "no_hp"],
          },
        ],
      });
      return res.status(201).json(userHotels);
    } catch (error) {
      throw new Error(
        "Error retrieving User-Hotel relationships: " + error.message
      );
    }
  },

  delete: async function (req, res) {
    const hotel_id = req.body.hotel_id; // Assuming hotel_id is in the request body

    if (!hotel_id) {
      return res
        .status(400)
        .json({ error: "hotel_id is required in the request body" });
    }

    try {
      const userHotel = await UserHotel.findOne({
        where: { user_id: req.user.id, hotel_id: hotel_id },
      });

      if (userHotel) {
        await userHotel.destroy();
        return res
          .status(200)
          .json({ message: "User-Hotel relationship deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ error: "User-Hotel relationship not found" });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error deleting User-Hotel relationship: " + error.message,
      });
    }
  },

  restore: async function (req, res) {
    try {
      const { id } = req.body;

      const userHotel = await UserHotel.findOne({
        where: {
          id,
          deleted_at: { [Op.ne]: null }, // Check if the user-hotel relationship is soft-deleted
        },
      });

      if (!userHotel) {
        return res.status(404).json({
          error: "User-Hotel relationship not found or not soft-deleted",
        });
      }

      // Reset deleted_at and deleted_by to null to indicate the relationship is restored
      await userHotel.restore();

      res
        .status(200)
        .json({ message: "User-Hotel relationship restored successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while restoring the User-Hotel relationship",
      });
    }
  },

  detail: async function (req, res) {
    try {
      const { id } = req.body;

      const user = await User.findOne({
        where: { id, deleted_at: null, deleted_by: null },
        include: [
          {
            model: User, // Assuming Biodata is the model for user profiles
            as: "user", // Use the alias defined in User model
          },
          {
            model: Hotel, // Assuming Hotel is the model for hotels
            as: "hotels", // Use the alias defined in User model
            through: { model: UserHotel, as: "user_hotel" }, // Use the alias defined in UserHotel model
          },
        ],
        // attributes: { exclude: ["no_hp"] },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.id != req.user.id) {
        return res.status(403).json({
          error: "You do not have permission to see this detail user",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  },
};

module.exports = UserHotelController;
