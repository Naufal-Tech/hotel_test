const moment = require("moment-timezone");

const BulkEmailController = {
  // Send bulk email to all subscribers
  bulkEmail: async function (req, res) {
    const { subject, message } = req.body;

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

    try {
      // Get all subscribers
      const subscribers = await models.NewsletterDB.find({
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      const emailList = subscribers.map((subscriber) => subscriber.email);

      // Save bulk email to database
      const bulkEmail = new models.BulkEmailDB({
        subject: subject,
        message: message,
        email: emailList,
      });
      await bulkEmail.save();

      // Send email to each subscriber
      for (const subscriber of subscribers) {
        // Construct the email message
        const mailOptions = {
          from: process.env.GMAIL,
          to: subscriber.email,
          subject: subject,
          html: message,
        };

        // Send the email message
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${subscriber.email}: ${info.response}`);
      }

      //send respond databack to postman
      res.status(200).json({
        message: "Bulk email sent to all subscribers",
      });
    } catch (error) {
      console.log(error);
      return response.error(500, "Failed to send bulk email", res);
    }
  },

  get: async function (req, res) {
    try {
      const bulkemail = await models.BulkEmailDB.find({
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });
      return response.ok(bulkemail, res, "Success");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  delete: async function (req, res) {
    const { bulkemail_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: bulkemail_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const bulkemail = await models.BulkEmailDB.findOne(filter);

    if (!bulkemail) {
      return response.error(400, "Bulk-Email not found", res);
    }

    const session = await models.BulkEmailDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      // Update the `VendorDB` document with the new data
      await models.BulkEmailDB.findByIdAndUpdate(
        bulkemail_id,
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

  searchSubject: async function (req, res) {
    try {
      const subject = req.query.subject;
      const slug = await models.BulkEmailDB.findOne({
        slug: subject,
      });
      if (!slug)
        return response.error(404, `Subject Bulking Email Not Found`, res);
      return response.ok(slug, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },
};

module.exports = BulkEmailController;
