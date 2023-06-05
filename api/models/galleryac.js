const mongoose = require("mongoose");
const moment = require("moment-timezone");
const slugify = require("slugify");

const defaultDate = moment().tz("Asia/Jakarta").format();

const AcSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
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

AcSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const GalleryAcDB = mongoose.model("galleryac", AcSchema, "galleryac");

module.exports = GalleryAcDB;
