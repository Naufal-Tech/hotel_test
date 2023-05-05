const current_date = moment().tz("Asia/Jakarta").format();

const OtpUserSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    unique: true,
  },
  otp: {
    type: String,
    expires: "3m",
  },

  /* CONFIG */
  updated_at: {
    type: Date,
  },

  created_by: String,

  created_at: {
    type: Date,
    default: current_date,
    expires: "3m",
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

// OtpUserSchema.index({ created_at: 1 }, { expireAfterSeconds: 180 });
OtpUserSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }

  next();
});

OtpUserSchema.methods.compareToken = async function (otp) {
  const result = await bcrypt.compare(otp, this.otp);
  return result;
};

const OtpUserDB = mongoose.model("otpuser", OtpUserSchema, "otpuser");

module.exports = OtpUserDB;
