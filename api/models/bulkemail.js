const defaultDate = moment().tz("Asia/Jakarta").format();

const BulkEmailSchema = new mongoose.Schema({
  email: {
    type: Array,
  },

  subject: {
    type: String,
  },

  message: {
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

BulkEmailSchema.pre("save", function (next) {
  this.slug = slugify(this.subject, { lower: true });
  next();
});

const BulkEmailDB = mongoose.model("bulkemail", BulkEmailSchema, "bulkemail");

module.exports = BulkEmailDB;
