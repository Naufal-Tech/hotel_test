const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const ContactUsController = {
  addContactUs: async function (req, res, next) {
    const { fullname, email, subject, pesan, keterangan, phone } = req.body;

    try {
      const moment = require("moment-timezone");
      const current_date = moment().tz("Asia/Jakarta").format();

      if (!userHelper.validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      //Create Contact Us
      const contactus = await models.ContactUsDB.create({
        fullname,
        email,
        subject,
        pesan,
        phone,
        keterangan,
        created_at: current_date,
      });

      // Send WhatsApp notification with request body
      const sendWhatsAppNotification = async () => {
        const message = `
  New contact inquiry:
    Fullname: ${fullname}
    Email: ${email}
    Subject: ${subject}
    Pesan: ${pesan}
    Phone: ${phone}
    Keterangan: ${keterangan}
    Created Date: ${contactus.created_at}
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

      // Send a contact us notification to our email address
      const MailOptions = {
        from: process.env.GMAIL,
        to: process.env.GMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
    <p>Hello,</p>
    <p>You have received a new contact form submission:</p>
    <ul>
      <li>Name: ${fullname}</li>
      <li>Email: ${email}</li>
      <li>Subject: ${subject}</li>
      <li>Message: ${pesan}</li>
    </ul>
    <p>Thank you!</p>
  `,
      };

      transporter.sendMail(MailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to customer: ${info.response}`);
        }
      });

      res.json({
        status: "success",
        data: contactus,
      });
    } catch (error) {
      next(appErr.appErr(error.message));
    }
  },

  delete: async function (req, res) {
    const { contactus_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: contactus_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const contactus = await models.ContactUsDB.findOne(filter);

    if (!contactus) {
      return response.error(400, "Contact-Us not found", res);
    }

    const session = await models.ContactUsDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      // Update the `VendorDB` document with the new data
      await models.ContactUsDB.findByIdAndUpdate(
        contactus_id,
        { deleted_time: deletedTime, deleted_by: req.user._id },
        options
      );

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
    let { contactus_id, is_active, keterangan } = req.body;

    // Start a session
    const session = await models.ContactUsDB.startSession();
    session.startTransaction();

    try {
      // Find the `POST` document to update
      const contactus = await models.ContactUsDB.findOne({
        _id: contactus_id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!contactus) {
        return response.error(404, "Contact-Us not found", res);
      }

      // Update the Post Variables
      contactus.fullname = keterangan;
      contactus.is_active = is_active;
      contactus.updated_by = req.user._id;
      contactus.updated_at = current_date;

      // Save the updated document
      const options = { session };
      await contactus.save(options);

      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const contactus = await models.ContactUsDB.findOneAndUpdate({
        _id: id,
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      if (!contactus) {
        return response.error(404, "Contact-Us is not found", res);
      }

      return response.ok(contactus, res, "Contact-Us is not found");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  get: async function (req, res, next) {
    try {
      //Find all contact us
      const contactus = await models.ContactUsDB.find();
      res.json({
        status: "success",
        data: contactus,
      });
    } catch (error) {
      next(appErr.appErr(error.message));
    }
  },
};

module.exports = ContactUsController;
