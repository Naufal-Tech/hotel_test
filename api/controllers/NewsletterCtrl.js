const moment = require("moment-timezone");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const NewsletterController = {
  newsletter: async function (req, res) {
    const { email } = req.body;

    if (!userHelper.validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // let img_profile = [];
    let emailTrim = email.trim();

    const session = await models.NewsletterDB.startSession();
    session.startTransaction();

    try {
      const current_date = moment().tz("Asia/Jakarta").format();
      // VALIDASI EMAIL
      const existingEmail = await models.NewsletterDB.findOne({
        email: { $regex: new RegExp(emailTrim, "i") },
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      if (existingEmail) {
        return response.error(
          400,
          `A user with the email '${emailTrim}' is already subscribed`,
          res
        );
      }

      //Create Customer Email on NewsletterDB:
      const newsletter = await models.NewsletterDB.create({
        email,
      });

      const sendWhatsAppMessage = async (message) => {
        try {
          const response = await client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${process.env.YOUR_PHONE_NUMBER}`,
            // from: `whatsapp:+14155238886`,
            // to: `whatsapp:+6287818411654`,
          });
          console.log("WhatsApp message sent:", response.sid);
        } catch (error) {
          console.error("Error sending WhatsApp message:", error);
        }
      };

      // Send WhatsApp notification
      const message = `New subscriber: ${newsletter.email}
      Created Date: ${newsletter.created_at}
      `;
      sendWhatsAppMessage(message);

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

      // Construct the email message with the verification link
      const mailOption = {
        from: process.env.GMAIL,
        to: email,
        subject: `Thank you for subscribing to our newsletter!`,
        html: `
  <p>Dear Subscriber,</p>
  <p>Thank you for subscribing to our newsletter. You will now receive regular updates from us.</p>
  `,
      };

      // Send the email message
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      // Construct the email message with the verification link
      const mailOptions = {
        from: process.env.GMAIL,
        to: process.env.GMAIL,
        subject: `A new subscriber: ${newsletter.email}`,
        html: `
        <p>There is a new subscriber to our newsletter, here is the detail:</p>
        <p>Subscribe time: ${newsletter.created_at}</p>
        <p>Here is the email: ${newsletter.email}</p>
    `,
      };

      // Send the email message
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      //send respond databack ke postman
      res.status(201).json({
        success: true,
        message: "Succesfully Subscribed to Newsletter",
        data: newsletter.email,
      });
    } catch (error) {
      return response.error(400, error.message, res, error);
    } finally {
      if (session) {
        session.endSession();
      }
    }
  },

  get: async function (req, res) {
    try {
      const newsletter = await models.NewsletterDB.find({
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });
      return response.ok(newsletter, res, "Success");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  delete: async function (req, res) {
    const { newsletter_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: newsletter_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const newsletter = await models.NewsletterDB.findOne(filter);

    if (!newsletter) {
      return response.error(400, "Newsletter not found", res);
    }

    const session = await models.NewsletterDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      // Update the `VendorDB` document with the new data
      await models.NewsletterDB.findByIdAndUpdate(
        newsletter_id,
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
};

module.exports = NewsletterController;
