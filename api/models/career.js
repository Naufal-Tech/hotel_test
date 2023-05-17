const mongoose = require("mongoose");
const moment = require("moment-timezone");
const slugify = require("slugify");

const defaultDate = moment().tz("Asia/Jakarta").format();

const CareerSchema = new mongoose.Schema({
  job_title: {
    type: String,
    required: true,
  },
  job_description: {
    type: String,
    required: true,
  },
  job_requirements: {
    type: [String],
    required: true,
  },
  job_location: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  contact_phone: {
    type: String,
    required: true,
  },
  applicant_id: [
    {
      type: String,
      ref: "applicant",
    },
  ],
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

CareerSchema.pre("save", function (next) {
  this.slug = slugify(this.job_title, { lower: true });
  next();
});

const CareerDB = mongoose.model("career", CareerSchema, "career");

module.exports = CareerDB;
