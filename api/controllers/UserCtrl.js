const {
  User,
  Follow,
  Biodata,
  UserHotel,
  Hotel,
  Sequelize,
} = require("../models");
const { Op } = require("sequelize");

const UserController = {
  register: async function (req, res) {
    try {
      const { nama, no_hp, alamat, email } = req.body;

      // Cek if the phone number (no_hp) already exists in the database
      const existingUser = await User.findOne({
        where: {
          no_hp,
          deleted_by: null, // ambil yang null, karena belum didelete
          deleted_at: null,
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Phone number is already in use." });
      }

      const newUser = await User.create({
        nama,
        no_hp,
        alamat,
        email,
        created_at: new Date(),
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the user." });
    }
  },

  login: async function (req, res) {
    try {
      const { no_hp } = req.body;

      const user = await User.findOne({
        where: {
          no_hp,
          deleted_by: null,
          deleted_at: null,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(200).json({ user: user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while logging in" });
    }
  },

  delete: async function (req, res) {
    try {
      const { id } = req.body;

      const user = await User.findOne({
        where: {
          id,
          deleted_by: null,
          deleted_at: null,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.deleted_by !== null || user.deleted_at !== null) {
        return res
          .status(400)
          .json({ error: "User has already been soft-deleted" });
      }

      if (user.id != req.user.id) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this user" });
      }

      const deletedByUserId = req.user.id;
      await user.update({
        deleted_at: new Date(),
        deleted_by: deletedByUserId,
      });

      res.status(200).json({ message: "User soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while soft-deleting the user" });
    }
  },

  restore: async function (req, res) {
    try {
      const { id } = req.body;

      const user = await User.findOne({
        where: {
          id,
          deleted_by: { [Op.ne]: null }, // Check if the user is soft-deleted
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.deleted_by === null) {
        return res.status(400).json({ error: "User is not soft-deleted" });
      }

      // Reset deleted_at and deleted_by to null to indicate user is restored
      await user.update({
        deleted_at: null,
        deleted_by: null,
      });

      res.status(200).json({ message: "User restored successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while restoring the user" });
    }
  },

  update: async function (req, res) {
    try {
      const { id, nama, no_hp, alamat, sales_code, saldo } = req.body;

      // Check if a user with the provided ID exists in the database
      const user = await User.findOne({
        where: {
          id,
          deleted_by: null,
          deleted_at: null,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the user has already been soft-deleted (deleted_by and deleted_at are not empty)
      if (user.deleted_by !== null || user.deleted_at !== null) {
        return res
          .status(400)
          .json({ error: "User has already been soft-deleted" });
      }

      // Check if the authenticated user is the same as the user who created the record
      if (user.id != req.user.id) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this user" });
      }

      // Check if the provided no_hp is the same as any other user's no_hp (excluding the current user)
      const duplicateUser = await User.findOne({
        where: {
          no_hp,
          id: {
            [Sequelize.Op.not]: id, // Exclude the current user's ID
          },
          deleted_by: null,
          deleted_at: null,
        },
      });

      if (duplicateUser) {
        return res.status(400).json({ error: "Phone number already in use" });
      }

      // Update the user information
      user.nama = nama;
      user.no_hp = no_hp;
      user.alamat = alamat;
      user.saldo = parseFloat(user.saldo) + parseFloat(saldo);
      user.sales_code = sales_code;
      user.updated_by = req.user.id;

      // Save the updated user data
      await user.save();

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  },

  get: async function (req, res) {
    try {
      const users = await User.findAll({
        where: { deleted_at: null, deleted_by: null },
        attributes: {
          exclude: [
            "created_at",
            "created_by",
            "deleted_at",
            "updated_by",
            "deleted_by",
          ],
        },
        include: [
          {
            model: Biodata,
            as: "biodata",
          },
        ],
      });

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  },

  detail: async function (req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: { id, deleted_at: null, deleted_by: null },
        // attributes: { exclude: ["no_hp"] },
      });

      if (user.id != req.user.id) {
        return res.status(403).json({
          error: "You do not have permission to see this detail user",
        });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  },

  viewProfile: async (req, res, next) => {
    try {
      const userId = req.user.id; // Get the user's ID from the token

      const user = await User.findOne({
        where: {
          id: userId,
          deleted_by: null,
          deleted_at: null,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Now, let's fetch the associated Biodata that matches the created_by field
      const biodata = await Biodata.findOne({
        where: {
          created_by: userId, // Match the created_by field with the user's ID
        },
      });

      // You can attach the biodata to the user if found
      if (biodata) {
        user.dataValues.biodata = biodata;
      }

      // Fetch the user's friends using the 'Follow' model
      const friends = await Follow.findAll({
        where: {
          user_id: userId,
        },
      });

      // Extract friend IDs from the 'friends_id' property
      const friendIds = friends.map((friend) => friend.friends_id);

      // Fetch the actual user objects based on friend IDs
      const userFriends = await User.findAll({
        where: {
          id: friendIds,
          deleted_by: null,
          deleted_at: null,
        },
      });

          // Attach the list of friends to the user object
    user.dataValues.friends = userFriends;

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while fetching the user's profile",
      });
    }
  },
};

module.exports = UserController;
