const { Booking, User, hotel_kamar, Sales } = require("../models");

const BookingController = {
  add: async function (req, res) {
    try {
      const {
        user_id,
        kamar_id,
        sales_code,
        tanggal_check_in,
        tanggal_check_out,
      } = req.body;

      // Rule 1: Cek apakah user exist
      const existingUser = await User.findOne({
        where: { id: user_id },
        deleted_by: null,
        deleted_at: null,
      });

      if (!existingUser) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // Rule 2: Apakah Sales Code Exist
      const salesRecord = await Sales.findOne({
        where: { coupon: sales_code },
      });

      if (!salesRecord) {
        return res.status(400).json({ error: "Invalid sales code" });
      }

      // Rule 3: Validasi Apakah kamar_id exist
      const roomRecord = await hotel_kamar.findByPk(kamar_id);

      if (!roomRecord) {
        return res.status(400).json({ error: "Invalid kamar_id" });
      }

      // Rule 4: Cek Apakah tanggal_check_out is higher than tanggal_check_in
      const checkInDate = new Date(tanggal_check_in);
      const checkOutDate = new Date(tanggal_check_out);

      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ error: "Invalid tanggal_check_out" });
      }

      // Kalkulasi harga_kamar based on the number of days
      const daysBetween = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      const harga_kamar = roomRecord.harga * daysBetween;

      // Rule 4: Kalkulasi pendapatan_bersih and pendapatan_sales
      const pendapatan_bersih = 0.8 * harga_kamar;
      const pendapatan_sales = 0.2 * harga_kamar;

      // Rule 5: Cek apakah saldo user cukup untuk melakukan booking
      if (existingUser.saldo < harga_kamar) {
        return res.status(400).json({ error: "Insufficient saldo" });
      }

      // Mengurangi the harga_kamar dari saldo user
      const updatedSaldo = existingUser.saldo - harga_kamar;

      // User tidak boleh menggunakan sales code yang sama dengan sebelumnya, lalu update saldo user dll
      if (existingUser.sales_code !== sales_code) {
        await User.update(
          { saldo: updatedSaldo, sales_code: sales_code },
          { where: { id: user_id } }
        );
      } else {
        return res.status(400).json({ error: "Sales code already in use" });
      }

      // Cek apakah the sales_code exist in Booking DB
      const existingBooking = await Booking.findOne({
        where: { sales_code: sales_code },
      });

      if (existingBooking) {
        return res
          .status(400)
          .json({ error: "Sales code already used in a booking" });
      }

      // Create a new booking
      const newBooking = await Booking.create({
        user_id,
        kamar_id,
        harga_kamar,
        pendapatan_bersih,
        pendapatan_sales,
        sales_code,
        tanggal_check_in,
        tanggal_check_out,
        created_at: new Date(),
      });

      // Update the Sales DB with commissions yang tersedia
      salesRecord.total_commission += harga_kamar;
      salesRecord.owner_commission += pendapatan_bersih;
      salesRecord.sales_commission += pendapatan_sales;
      await salesRecord.save();

      res.status(201).json(newBooking);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the booking." });
    }
  },

  delete: async function (req, res) {
    try {
      const { id } = req.body;

      const booking = await Booking.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking is not found" });
      }

      await booking.update({
        deleted_at: new Date(),
      });

      res.status(200).json({ message: "Booking soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while soft-deleting the Booking",
      });
    }
  },

  get: async function (req, res) {
    try {
      const booking = await Booking.findAll({
        where: { deleted_at: null },
      });

      res.status(200).json(booking);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching booking" });
    }
  },

  detail: async function (req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findOne({
        where: { id },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Return the user as a JSON response
      res.status(200).json(booking);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the Booking" });
    }
  },
};

module.exports = BookingController;
