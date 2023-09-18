const { User } = require("../models");

const UserController = {
  register: async function (req, res) {
    try {
      const { nama, no_hp, alamat } = req.body;

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

      // Update the user information
      user.nama = nama;
      user.no_hp = no_hp;
      user.alamat = alamat;
      user.sales_code = sales_code;
      user.saldo = saldo;
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
        // attributes: { exclude: ["no_hp"] }, // Exclude the password field from the result
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
      const userId = req.user.id; // Cek user dari token

      const user = await User.findOne({
        where: {
          id: userId,
          deleted_by: null, // ambil yang null, karena belum didelete
          deleted_at: null,
        },
        // attributes: { exclude: ["no_hp"] },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

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
