const defaultDate = moment().tz("Asia/Jakarta").format();

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  /* CONFIG */
  created_at: {
    type: Date,
    default: defaultDate,
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

const NewsletterDB = mongoose.model(
  "newsletter",
  NewsletterSchema,
  "newsletter"
);

module.exports = NewsletterDB;
