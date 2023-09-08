const { Hotel } = require("../models");

const HotelController = {
  add: async function (req, res) {
    try {
      const { nama, alamat, no_hp, room_list } = req.body;

      const newHotel = await Hotel.create({
        nama,
        alamat,
        no_hp,
        room_list,
        created_at: new Date(),
      });

      res.status(201).json(newHotel);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the hotel" });
    }
  },

  delete: async function (req, res) {
    try {
      const { id } = req.body;

      const hotel = await Hotel.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      await hotel.update({
        deleted_at: new Date(),
      });

      res.status(200).json({ message: "Hotel soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while soft-deleting the hotel" });
    }
  },

  update: async function (req, res) {
    try {
      const { id, nama, alamat, no_hp } = req.body;

      const hotel = await Hotel.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      hotel.nama = nama;
      hotel.no_hp = no_hp;
      hotel.alamat = alamat;

      await hotel.save();

      res.status(200).json({ hotel });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the hotel" });
    }
  },

  get: async function (req, res) {
    try {
      const hotels = await Hotel.findAll({
        where: { deleted_at: null },
      });

      res.status(200).json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  },

  detail: async function (req, res) {
    try {
      const { id } = req.params;

      const hotel = await Hotel.findOne({
        where: { id, deleted_at: null },
      });

      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      res.status(200).json(hotel);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  },
};

module.exports = HotelController;
