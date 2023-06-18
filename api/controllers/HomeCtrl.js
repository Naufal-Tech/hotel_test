const cloudinary = require("cloudinary").v2;
const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const HomeController = {
  create: async function (req, res) {
    const { title, description } = req.body;

    // Check if all fields are present
    if (!title || !description || !req.file) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    try {
      // Validate file extension
      const allowedExtensions = ["png", "jpeg", "jpg"];
      const fileExtension = req.file.originalname
        .split(".")
        .pop()
        .toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message:
            "Invalid file extension. Only JPEG, JPG and PNG files are allowed.",
        });
      }

      // Upload image to Cloudinary
      const image = await cloudinary.uploader.upload(req.file.path, {
        folder: "AMERTA_HOME",
        resource_type: "auto",
      });

      // Create the gallery record
      const gallery = await models.GalleryHomeDB.create({
        title,
        description,
        image: image.secure_url,
        created_at: current_date,
      });

      // Return the success response
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Gallery created successfully",
        data: gallery,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while creating the gallery record",
        error: error.message,
      });
    }
  },

  update: async function (req, res) {
    let { galleryhome_id, title, description } = req.body;
    let image = null;

    if (!galleryhome_id) {
      return response.error(
        400,
        "Please input galleryhome_id",
        res,
        "Please input galleryhome_id"
      );
    }

    // Check if a new cover image file is provided
    if (req.file) {
      try {
        // Upload the image file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "AMERTA_HOME", // Specify a folder to store the image in (optional)
        });

        // Get the secure URL of the uploaded image
        image = result.secure_url;
      } catch (error) {
        return response.error(500, "Failed to upload cover image", res, error);
      }
    }

    // Start a session
    const session = await models.GalleryHomeDB.startSession();
    session.startTransaction();

    try {
      // Find the `POST` document to update
      const galleryhome = await models.GalleryHomeDB.findOne({
        _id: galleryhome_id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!galleryhome) {
        return response.error(404, "Image Home Gallery not found", res);
      }

      // Update the Post Variables
      galleryhome.title = title;
      galleryhome.description = description;
      if (image) {
        galleryhome.image = image;
      }
      galleryhome.updated_by = req.user._id;
      galleryhome.updated_at = current_date;

      // Save the updated document
      const options = { session };
      await galleryhome.save(options);

      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  delete: async function (req, res) {
    const { galleryhome_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: galleryhome_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const galleryhome = await models.GalleryHomeDB.findOne(filter);
    if (!galleryhome) {
      return response.error(
        400,
        "Home Gallery Image not found",
        res,
        "Home Gallery Image not found"
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

    const session = await models.GalleryHomeDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      const galleryhome = await models.GalleryHomeDB.findByIdAndUpdate(
        galleryhome_id,
        { deleted_time: deletedTime, deleted_by: req.user._id },
        options
      );

      await galleryhome.save();

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
      const galleryhome = await models.GalleryHomeDB.find({
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });
      return response.ok(galleryhome, res, "Successfully Retrieved All Images");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const galleryhome = await models.GalleryHomeDB.findOne({
        _id: id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!galleryhome) {
        return response.error(404, "Image Not Found", res);
      }

      return response.ok(galleryhome, res, "Successfully Retrieved The Image");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },
};

module.exports = HomeController;