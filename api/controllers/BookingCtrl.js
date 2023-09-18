const { Booking, User, hotel_kamar, Sales } = require("../models");

const BookingController = {
  add: async function (req, res) {
    try {
      const {
        user_id,
        kamar_id,
        tanggal_check_in,
        tanggal_check_out,
        sales_code,
      } = req.body;

      // Rule 1: Cek apakah user exist
      const existingUser = await User.findOne({
        where: { id: user_id, deleted_by: null, deleted_at: null },
      });

      if (!existingUser) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // Rule 2: Apakah Sales Code Exist (process only if sales_code is provided)
      let salesRecord;
      if (sales_code) {
        salesRecord = await Sales.findOne({
          where: { coupon: sales_code, deleted_at: null },
        });

        if (!salesRecord) {
          return res.status(400).json({ error: "Invalid sales code" });
        }
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
      const daysBetween = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24); // mili * seconds * hours * day
      const harga_kamar = roomRecord.harga * daysBetween;

      // Rule 4: Kalkulasi pendapatan_bersih and pendapatan_sales
      const pendapatan_bersih = 0.8 * harga_kamar; // 80%
      const pendapatan_sales = 0.2 * harga_kamar; // 20%

      // Rule 5: Cek apakah saldo user cukup untuk melakukan booking
      if (existingUser.saldo < harga_kamar) {
        return res.status(400).json({ error: "Insufficient saldo" });
      }

      // Mengurangi the harga_kamar dari saldo user
      const updatedSaldo = existingUser.saldo - harga_kamar;

      // If - else: Update user (Kalau sales_code tidak sama dengan sales_code exisitng user )
      // User tidak boleh menggunakan sales code yang sama dengan sebelumnya, lalu update saldo user dll
      if (sales_code && existingUser.sales_code !== sales_code) {
        // Check if the sales code is already used in a booking
        const existingBooking = await Booking.findOne({
          where: { sales_code: sales_code, deleted_at: null, deleted_by: null },
        });

        if (existingBooking) {
          return res
            .status(400)
            .json({ error: "Sales code already used in a booking" });
        }

        // If the sales code is not already used, update the user
        await User.update(
          { saldo: updatedSaldo, sales_code: sales_code },
          { where: { id: user_id, deleted_by: null, deleted_at: null } }
        );
      } else if (sales_code) {
        return res.status(400).json({ error: "Sales code already in use" });
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
      if (salesRecord) {
        salesRecord.total_commission += harga_kamar;
        salesRecord.owner_commission += pendapatan_bersih;
        salesRecord.sales_commission += pendapatan_sales;
        await salesRecord.save();
      }

      response.ok(newBooking, res, "Booking created successfully");
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
          deleted_by: null,
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
        where: { deleted_by: null, deleted_at: null },
      });
      response.ok(booking, res, "View All Booking");
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
        where: { id, deleted_by: null, deleted_at: null },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      response.ok(booking, res, "View Detail Booking");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the Booking" });
    }
  },
};

module.exports = BookingController;
