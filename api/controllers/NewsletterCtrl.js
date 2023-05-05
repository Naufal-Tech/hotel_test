const moment = require("moment-timezone");

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
          `A user with the Email: '${emailTrim}' already exists`,
          res
        );
      }

      //Create Customer Email on NewsletterDB:
      const newsletter = await models.NewsletterDB.create({
        email,
      });

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
};

module.exports = NewsletterController;
