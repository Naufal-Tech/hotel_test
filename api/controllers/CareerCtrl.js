const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const CareerController = {
  create: async function (req, res) {
    const {
      job_title,
      job_description,
      job_requirements,
      job_location,
      job_type,
      contact_email,
      contact_phone,
    } = req.body;

    // Check if all fields are present
    if (
      !job_title ||
      !job_description ||
      !job_requirements ||
      !job_location ||
      !job_type ||
      !contact_email ||
      !contact_phone
    ) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    // Check user's role
    if (req.user.role !== "Master" && req.user.role !== "Manager") {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    try {
      // Create the career record
      const career = await models.CareerDB.create({
        job_title,
        job_description,
        job_requirements,
        job_location,
        job_type,
        contact_email,
        contact_phone,
        created_by: req.user._id,
        created_at: current_date,
      });

      // Return the success response
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Career record created successfully",
        data: career,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while creating the career record",
        error: error.message,
      });
    }
  },

  delete: async function (req, res) {
    const { career_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: career_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const career = await models.CareerDB.findOne(filter);
    if (!career) {
      return response.error(400, "User not found", res, "User not found");
    }

    // Check user's role
    if (req.user.role !== "Master" && req.user.role !== "Manager") {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    const session = await models.CareerDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      await models.CareerDB.findByIdAndUpdate(
        career_id,
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
    const moment = require("moment-timezone");
    const current_date = moment().tz("Asia/Jakarta").format();

    const {
      career_id,
      job_title,
      job_description,
      job_requirements,
      job_location,
      job_type,
      contact_email,
      contact_phone,
    } = req.body;

    try {
      // Find the career record by ID
      const career = await models.CareerDB.findById(career_id);

      if (!career) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Career record not found",
        });
      }

      // Check user's role
      if (req.user.role !== "Master" && req.user.role !== "Manager") {
        return res.status(401).json({
          success: false,
          status: 401,
          message: "Unauthorized",
        });
      }

      // Update the career fields
      career.job_title = job_title || career.job_title;
      career.job_description = job_description || career.job_description;
      career.job_requirements = job_requirements || career.job_requirements;
      career.job_location = job_location || career.job_location;
      career.job_type = job_type || career.job_type;
      career.contact_email = contact_email || career.contact_email;
      career.contact_phone = contact_phone || career.contact_phone;
      career.updated_at = current_date;
      career.updated_by = req.user._id;

      // Save the updated career record
      const updatedCareer = await career.save();

      // Return the success response
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Career record updated successfully",
        data: updatedCareer,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while updating the career record",
        error: error.message,
      });
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const career = await models.CareerDB.findOne({
        _id: id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!career) {
        return response.error(404, "Career Not Found", res);
      }

      return response.ok(
        career,
        res,
        "Successfully retrieved available positions"
      );
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  get: async function (req, res) {
    try {
      const career = await models.CareerDB.find({
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });
      return response.ok(
        career,
        res,
        "Successfully retrieved all available positions"
      );
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },
};

module.exports = CareerController;
