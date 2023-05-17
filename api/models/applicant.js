const mongoose = require("mongoose");
const moment = require("moment-timezone");
const slugify = require("slugify");

const defaultDate = moment().tz("Asia/Jakarta").format();

const ApplicantSchema = new mongoose.Schema({
  job_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "career",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  domicile: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  latest_education: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  cv: {
    type: String, // Assuming the CV file will be stored as a string (file path or URL)
    required: true,
  },
  contact_phone: {
    type: String,
    required: true,
  },
  email: {
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

ApplicantSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const ApplicantDB = mongoose.model("applicant", ApplicantSchema, "applicant");

module.exports = ApplicantDB;
