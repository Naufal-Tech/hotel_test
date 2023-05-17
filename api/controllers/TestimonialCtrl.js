const cloudinary = require("cloudinary").v2;
const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const TestimonialController = {
  create: async function (req, res) {
    const { testimoni, rating, name, organization } = req.body;

    // Check if all fields are present
    if (!testimoni || !rating || !name || !organization) {
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
      // Upload picture to Cloudinary
      //   const pictureResult = await cloudinary.uploader.upload(req.file.path, {
      //     folder: "testimonials",
      //     resource_type: "image",
      //   });

      let pictureUrl;

      if (req.file) {
        // Upload picture to Cloudinary
        const pictureResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "testimonials",
          resource_type: "image",
        });
        pictureUrl = pictureResult.secure_url;
      } else {
        // Check if the 'picture' field is missing
        if (!req.body.picture) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "A picture is required",
          });
        }
        pictureUrl = req.body.picture;
      }

      // Create the testimonial
      const testimonial = await models.TestimonialDB.create({
        testimoni,
        picture: pictureUrl,
        rating,
        name,
        organization,
        created_by: req.user._id,
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Testimonial created successfully",
        data: testimonial,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while creating the testimonial",
        error: error.message,
      });
    }
  },

  delete: async function (req, res) {
    const { testimonial_id } = req.body;
    const moment = require("moment-timezone");
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: testimonial_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const testimonial = await models.TestimonialDB.findOne(filter);
    if (!testimonial) {
      return response.error(
        400,
        "Testimonial not found",
        res,
        "Testimonial not found"
      );
    }

    // Check user's role
    if (req.user.role !== "Master" && req.user.role !== "Manager") {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    const session = await models.TestimonialDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      await models.TestimonialDB.findByIdAndUpdate(
        testimonial_id,
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
    const { testimonial_id, testimoni, rating, name, organization } = req.body;

    if (!testimoni || !rating || !name || !organization) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    try {
      let updatedFields = {
        testimoni,
        rating,
        name,
        organization,
        updated_at: current_date,
        updated_by: req.user._id,
      };

      // Check if a new picture is provided
      //   if (req.file) {
      //     // Upload picture to Cloudinary
      //     const pictureResult = await cloudinary.uploader.upload(req.file.path, {
      //       folder: "testimonials",
      //       resource_type: "image",
      //     });
      //     updatedFields.picture = pictureResult.secure_url;
      //   }

      // Check if a new picture is provided
      if (req.file) {
        // Upload picture to Cloudinary
        const pictureResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "testimonials",
          resource_type: "image",
        });
        updatedFields.picture = pictureResult.secure_url;
      } else {
        // Check if the 'picture' field is missing
        if (!req.body.picture) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "A picture is required",
          });
        }
      }

      // Update the testimonial
      const updatedTestimonial = await models.TestimonialDB.findByIdAndUpdate(
        testimonial_id,
        updatedFields,
        { new: true }
      );

      if (!updatedTestimonial) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Testimonial not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Testimonial updated successfully",
        data: updatedTestimonial,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while updating the testimonial",
        error: error.message,
      });
    }
  },

  get: async function (req, res) {
    try {
      const testimonial = await models.TestimonialDB.find({
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });
      return response.ok(
        testimonial,
        res,
        "Successfully retrieved all testimonials"
      );
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const testimonial = await models.TestimonialDB.findOne({
        _id: id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!testimonial) {
        return response.error(404, "Testimonial Not Found", res);
      }

      return response.ok(
        testimonial,
        res,
        "Successfully Retrieved Testimonial"
      );
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },
};

module.exports = TestimonialController;
