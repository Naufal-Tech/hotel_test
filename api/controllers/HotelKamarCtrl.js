const { hotel_kamar, Hotel } = require("../models");

const HotelKamarController = {
  add: async function (req, res) {
    try {
      const { hotel_id, name_kamar, nomor_kamar, harga } = req.body;

      const hotel = await Hotel.findByPk(hotel_id);

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const createdKamar = await hotel_kamar.create({
        hotel_id,
        name_kamar,
        nomor_kamar,
        harga,
        created_at: new Date(),
      });

      return res.status(201).json(createdKamar);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  update: async function (req, res) {
    try {
      const { id, hotel_id, name_kamar, nomor_kamar, harga } = req.body;

      const hotel = await Hotel.findByPk(hotel_id);

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const kamar = await hotel_kamar.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!kamar) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      kamar.hotel_id = hotel_id;
      kamar.name_kamar = name_kamar;
      kamar.nomor_kamar = nomor_kamar;
      kamar.harga = harga;

      await kamar.save();

      res.status(200).json({ kamar });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the hotel kamar" });
    }
  },

  delete: async function (req, res) {
    try {
      const { id } = req.body;

      const kamar = await hotel_kamar.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!kamar) {
        return res.status(404).json({ error: "Kamar Hotel not found" });
      }

      await kamar.update({
        deleted_at: new Date(),
      });

      res.status(200).json({ message: "Kamar soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while soft-deleting the kamar hotel",
      });
    }
  },

  get: async function (req, res) {
    try {
      const kamar = await hotel_kamar.findAll({
        where: { deleted_at: null },
      });

      res.status(200).json(kamar);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  },

  detail: async function (req, res) {
    try {
      const { id } = req.params;

      const kamar = await hotel_kamar.findOne({
        where: { id },
      });

      if (!kamar) {
        return res.status(404).json({ error: "Kamar Hotel not found" });
      }

      res.status(200).json(kamar);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the Kamar" });
    }
  },
};

module.exports = HotelKamarController;
