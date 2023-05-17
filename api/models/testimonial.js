const mongoose = require("mongoose");
const moment = require("moment-timezone");
const cloudinary = require("cloudinary").v2;
const validRatings = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const defaultDate = moment().tz("Asia/Jakarta").format();

const TestimonialSchema = new mongoose.Schema({
  testimoni: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return validRatings.includes(value);
      },
      message:
        "Invalid rating value. Valid ratings: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5",
    },
  },
  name: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },

  /* CONFIG */
  created_at: {
    type: Date,
    default: defaultDate,
  },

  updated_at: {
    type: Date,
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  deleted_time: Date,

  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Pre-save middleware to upload the testimonial picture to Cloudinary
TestimonialSchema.pre("save", async function (next) {
  if (this.isModified("picture")) {
    try {
      const uploadResult = await cloudinary.uploader.upload(this.picture, {
        folder: "testimonials",
        resource_type: "image",
      });
      this.picture = uploadResult.secure_url;
    } catch (error) {
      throw new Error("Failed to upload testimonial picture to Cloudinary");
    }
  }
  next();
});

const TestimonialDB = mongoose.model(
  "testimonial",
  TestimonialSchema,
  "testimonial"
);

module.exports = TestimonialDB;
