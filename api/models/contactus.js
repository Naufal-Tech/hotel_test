const defaultDate = moment().tz("Asia/Jakarta").format();

const ContactUsSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
  },

  pesan: {
    type: String,
  },

  keterangan: {
    type: String,
  },

  phone: {
    type: Number,
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

const ContactUsDB = mongoose.model("contactus", ContactUsSchema, "contactus");

module.exports = ContactUsDB;
