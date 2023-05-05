const defaultDate = moment().tz("Asia/Jakarta").format();

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },

  role: {
    type: String,
    enum: ["Master", "Manager", "Admin"],
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
  },

  slug: {
    type: String,
  },

  img_profile: {
    type: String,
    default: null,
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

UserSchema.pre("save", function (next) {
  this.slug = slugify(this.fullname, { lower: true });
  next();
});

const UserDB = mongoose.model("user", UserSchema, "user");

module.exports = UserDB;
