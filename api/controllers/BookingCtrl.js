const moment = require("moment-timezone");
const current_date = moment.tz(new Date(), "Asia/Jakarta").toDate();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const BookingController = {
  create: async function (req, res) {
    const {
      fullname,
      layanan,
      email,
      permintaan_special,
      latitude,
      longitude,
      phone,
      booking_date,
      alamat,
    } = req.body;

    // Start a session
    const session = await models.BookingDB.startSession();
    session.startTransaction();

    if (!userHelper.validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const options = { session };
      // Create the new `Category` document
      const booking = new models.BookingDB({
        bookingId: await userHelper.generateBookingId(),
        fullname,
        layanan,
        email,
        permintaan_special,
        latitude,
        longitude,
        phone,
        booking_date,
        alamat,
      });

      // Send WhatsApp notification with request body
      const sendWhatsAppNotification = async () => {
        const message = `
          New Booking Received:
          Booking ID: ${booking.bookingId}
          Fullname: ${fullname}
          Email: ${email}
          Phone: ${phone}
          Layanan: ${layanan}
          Permintaan Special: ${permintaan_special || "None"}
          Latitude: ${latitude}
          Longitude: ${longitude}
          Booking Date: ${booking_date}
          Alamat: ${alamat}
  `;

        try {
          const response = await client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${process.env.YOUR_PHONE_NUMBER}`,
          });
          console.log("WhatsApp notification sent:", response.sid);
        } catch (error) {
          console.error("Error sending WhatsApp notification:", error);
        }
      };

      // Call the function to send WhatsApp notification
      sendWhatsAppNotification();

      // create reusable transporter object using the configuration
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.SMTP_GMAIL,
        },
      });

      // Send a thank-you email to the customer
      const customerMailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: `Thank you for booking our service!`,
        html: `
      <p>Dear ${fullname},</p>
      <p>Thank you for booking our service. We look forward to providing you with a great experience!</p>
      <p>Here are the details of your booking:</p>
      <ul>
        <li>Booking ID: ${booking.bookingId}</li>
      </ul>
    `,
      };

      transporter.sendMail(customerMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to customer: ${info.response}`);
        }
      });

      // Send an email to the company with the booking details
      const companyMailOptions = {
        from: process.env.GMAIL,
        to: process.env.GMAIL,
        subject: `New Booking: ${email}`,
        html: `
      <p>Here are the details of the new booking:</p>
      <ul>
        <li>Booking ID: ${booking.bookingId}</li>
        <li>Booking Date: ${booking.booking_date}</li>
        <li>Fullname: ${fullname}</li>
        <li>Customer Email: ${email}</li>
        <li>Customer Phone Number: ${phone}</li>
        <li>Service: ${layanan}</li>
        <li>Special Requests: ${permintaan_special || "None"}</li>
        <li>Location: (${latitude}, ${longitude})</li>
        <li>Alamat: ${alamat}</li>
      </ul>
    `,
      };

      transporter.sendMail(companyMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to company: ${info.response}`);
        }
      });

      // Save the new category with session
      await booking.save(options);
      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  update: async function (req, res) {
    const { booking_id, is_active, keterangan } = req.body;

    try {
      // Start a session

      session = await models.BookingDB.startSession();
      session.startTransaction();

      const options = { session };

      // Find the `Booking` document to update
      const booking = await models.BookingDB.findOne({
        _id: booking_id,
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      if (!booking) {
        return response.error(
          404,
          "Booking is not found or already deleted",
          res
        );
      }

      // Update the Booking Fields
      booking.is_active = is_active;
      booking.keterangan = keterangan;
      // booking.updated_by = req.user._id;
      booking.updated_at = current_date;

      // create reusable transporter object using the configuration
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.SMTP_GMAIL,
        },
      });

      // Send an email to the company with the booking details
      const companyMailOptions = {
        from: process.env.GMAIL,
        to: process.env.GMAIL,
        subject: `Update Booking with E-mail: ${booking.email}`,
        html: `
      <p>Here are the details of the updated booking:</p>
      <ul>
        <li>Booking ID: ${booking.bookingId}</li>
        <li>Status Booking: ${booking.is_active}</li>
        <li>Customer Name: ${booking.fullname}</li>
        <li>Service: ${booking.layanan}</li>
        <li>Special requests: ${booking.permintaan_special || "None"}</li>
        <li>Location: (${booking.latitude}, ${booking.longitude})</li>
        <li>Customer email: ${booking.email}</li>
        <li>Customer phone number: ${booking.phone}</li>
      </ul>
    `,
      };

      transporter.sendMail(companyMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to company: ${info.response}`);
        }
      });

      // Save the updated document
      await booking.save(options);

      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      session.abortTransaction();
      session.endSession();
      return response.error(500, err.message, res);
    }
  },

  delete: async function (req, res) {
    const { booking_id } = req.body;

    try {
      // Start a session
      const session = await models.BookingDB.startSession();
      session.startTransaction();

      // Create the options object with the session property
      const options = { session };

      // Find the `Product` document to delete and update it
      const booking = await models.BookingDB.findOne({
        _id: booking_id,
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      // Validate if the user is authorized to delete the live comment
      if (!booking) {
        return response.error(
          404,
          `Comment is not found or already deleted`,
          res
        );
      }

      // Delete Live Comment
      await models.BookingDB.findByIdAndUpdate(
        { _id: booking_id },
        {
          $set: {
            // deleted_by: req.user._id,
            deleted_time: current_date,
          },
        },
        { new: true, ...options }
      );

      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      // session variable should be defined
      session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  get: async function (req, res) {
    try {
      const booking = await models.BookingDB.find({
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });
      return response.ok(booking, res, "Success");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  searchIdBooking: async function (req, res) {
    try {
      const id = req.query.id;
      const booking = await models.BookingDB.findOne({
        bookingId: id,
      });
      if (!booking) return response.error(404, `Booking ID Not Found`, res);
      return response.ok(booking, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  searchEmail: async function (req, res) {
    try {
      const email = req.query.email;
      const booking = await models.BookingDB.findOne({
        email: email,
      });
      if (!booking) return response.error(404, `Booking Email Not Found`, res);
      return response.ok(booking, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  searchPhone: async function (req, res) {
    try {
      const phone = req.query.phone;
      const booking = await models.BookingDB.findOne({
        phone: phone,
      });
      if (!booking) return response.error(404, `Booking Phone Not Found`, res);
      return response.ok(booking, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  searchService: async function (req, res) {
    try {
      const service = req.query.service;
      const booking = await models.BookingDB.findOne({
        slug_layanan: service,
      });
      if (!booking)
        return response.error(404, `Booking Service Not Found`, res);
      return response.ok(booking, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  searchFullname: async function (req, res) {
    try {
      const fullname = req.query.fullname;
      const booking = await models.BookingDB.findOne({
        slug_fullname: fullname,
      });
      if (!booking)
        return response.error(404, `Booking Fullname Not Found`, res);
      return response.ok(booking, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },
};

module.exports = BookingController;
