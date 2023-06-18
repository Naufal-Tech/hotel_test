const cloudinary = require("cloudinary").v2;
const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const PromoController = {
  create: async function (req, res) {
    const {
      promo_title,
      promo_category,
      promo_description,
      promo_location,
      promo_condition,
      start_date,
      end_date,
    } = req.body;

    // Check if all fields are present
    if (
      !promo_title ||
      !promo_category ||
      !promo_description ||
      !promo_location ||
      !promo_condition ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    try {
      // Validate file extension
      if (req.file) {
        const allowedExtensions = ["jpeg", "png", "jpg"];
        const fileExtension = req.file.originalname
          .split(".")
          .pop()
          .toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          return res.status(400).json({
            success: false,
            status: 400,
            message:
              "Invalid file extension. Only JPEG, PNG and JPG files are allowed.",
          });
        }
      }

      // Upload CV to Cloudinary
      let image;

      if (req.file) {
        // Upload CV file to Cloudinary
        const imageResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "PROMO_AMERTA",
          resource_type: "auto",
        });
        image = imageResult.secure_url;
      } else {
        // Check if the 'cv' field is missing
        if (!req.body.promo_img) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "Promo image file is required",
          });
        }
        promo_img = req.body.promo_img;
      }

      // Create the applicant record
      const promo = await models.PromoDB.create({
        promo_title,
        promo_category,
        promo_description,
        promo_location,
        promo_condition,
        start_date,
        end_date,
        promo_img: image,
        created_by: req.user._id,
        created_at: current_date,
      });

      await promo.save();

      // Return the success response
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Promo created successfully",
        data: promo,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while creating the promo",
        error: error.message,
      });
    }
  },

  update: async function (req, res) {
    const moment = require("moment-timezone");
    const current_date = moment().tz("Asia/Jakarta").format();

    const {
      promo_id,
      promo_title,
      promo_category,
      promo_description,
      promo_location,
      promo_condition,
      promo_status,
      start_date,
      end_date,
    } = req.body;

    try {
      // Find the career record by ID
      const promo = await models.PromoDB.findById(promo_id);

      if (!promo) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Promo not found",
        });
      }

      let promo_img;

      // Check if a new cover image file is provided
      if (req.file) {
        try {
          const allowedExtensions = ["jpeg", "png", "jpg"];
          const fileExtension = req.file.originalname
            .split(".")
            .pop()
            .toLowerCase();

          if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({
              success: false,
              status: 400,
              message:
                "Invalid file extension. Only JPEG, PNG and JPG files are allowed.",
            });
          }

          // Upload the image file to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "PROMO_AMERTA", // Specify a folder to store the image in (optional)
          });

          // Get the secure URL of the uploaded image
          promo_img = result.secure_url;
        } catch (error) {
          return response.error(
            500,
            "Failed to upload cover image",
            res,
            error
          );
        }
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
      promo.promo_title = promo_title || promo.promo_title;
      promo.promo_category = promo_category || promo.promo_category;
      promo.promo_description = promo_description || promo.promo_description;
      promo.promo_location = promo_location || promo.promo_location;
      promo.promo_condition = promo_condition || promo.promo_condition;
      promo.promo_status = promo_status || promo.promo_status;
      promo.start_date = start_date || promo.start_date;
      promo.end_date = end_date || promo.end_date;
      promo.promo_img = promo_img || promo.promo_img;
      promo.updated_at = current_date;
      promo.updated_by = req.user._id;

      // Save the updated promo
      const updatedPromo = await promo.save();

      // Return the success response
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Promo Updated Successfully",
        data: updatedPromo,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while updating the promo",
        error: error.message,
      });
    }
  },

  delete: async function (req, res) {
    const { promo_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: promo_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
      promo_status: { $exists: false },
    };

    const promo = await models.PromoDB.findOne(filter);
    if (!promo) {
      return response.error(400, "Promo not found", res, "Promo not found");
    }

    // Check user's role
    if (req.user.role !== "Master" && req.user.role !== "Manager") {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    const session = await models.PromoDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      let promo = await models.PromoDB.findByIdAndUpdate(
        promo_id,
        { deleted_time: deletedTime, deleted_by: req.user._id },
        options
      );

      await promo.save();

      await session.commitTransaction();
      session.endSession();

      return response.ok(true, res, "Success");
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  get: async function (req, res) {
    try {
      const promo = await models.PromoDB.find({
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
        promo_status: { $exists: true },
      });
      return response.ok(promo, res, "Successfully retrieved All Promo");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const promo = await models.PromoDB.findOne({
        _id: id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
        promo_status: { $exists: false },
      });

      if (!promo) {
        return response.error(404, "Career Not Found", res);
      }

      return response.ok(promo, res, "Successfully Retrieved The Applicant");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },
};

module.exports = PromoController;
