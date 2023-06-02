const defaultDate = moment().tz("Asia/Jakarta").format();

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
  },

  fullname: {
    type: String,
  },

  alamat: {
    type: String,
  },

  provinsi: {
    type: String,
  },

  kota: {
    type: String,
  },

  kecamatan: {
    type: String,
  },

  kelurahan: {
    type: String,
  },

  postalCode: {
    type: String,
  },

  layanan: {
    type: String,
  },

  email: {
    type: String,
  },

  permintaan_special: {
    type: String,
  },

  latitude: {
    type: String,
  },

  longitude: {
    type: String,
  },

  phone: {
    type: String,
  },

  keterangan: {
    type: String,
  },

  booking_date: {
    type: Date,
  },

  slug_layanan: {
    type: String,
  },

  slug_fullname: {
    type: String,
  },

  is_active: {
    type: Boolean,
    default: false,
  },

  /* CONFIG */
  created_at: {
    type: Date,
    default: defaultDate,
  },

  updated_at: {
    type: Date,
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

BookingSchema.pre("save", function (next) {
  this.slug_layanan = slugify(this.layanan, { lower: true });
  next();
});

BookingSchema.pre("save", function (next) {
  this.slug_fullname = slugify(this.fullname, { lower: true });
  next();
});

const BookingDB = mongoose.model("booking", BookingSchema, "booking");

module.exports = BookingDB;
