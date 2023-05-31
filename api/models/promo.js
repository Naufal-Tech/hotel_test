const mongoose = require("mongoose");
const moment = require("moment-timezone");
const slugify = require("slugify");

const defaultDate = moment().tz("Asia/Jakarta").format();

const PromoSchema = new mongoose.Schema({
  promo_title: {
    type: String,
    required: true,
  },

  promo_img: {
    type: String,
    required: true,
  },

  promo_description: {
    type: String,
  },

  start_date: {
    type: Date,
  },

  end_date: {
    type: Date,
  },

  promo_category: {
    type: String,
    enum: [
      "Air Conditioner",
      "Kelistrikan",
      "Konstruksi Bangunan",
      "Perbaikan Pipa Air",
      "Perbaikan Mesin",
      "Jual",
      "Sewa",
    ],
    required: true,
  },

  promo_status: {
    type: Boolean,
    default: true,
  },

  promo_location: {
    type: [String],
  },

  promo_condition: {
    type: [String],
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

PromoSchema.pre("save", function (next) {
  this.slug = slugify(this.promo_title, { lower: true });
  next();
});

const PromoDB = mongoose.model("promo", PromoSchema, "promo");

module.exports = PromoDB;
