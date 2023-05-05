const defaultDate = moment.tz(Date.now(), "Asia/Jakarta");

const TokenVerifikasiSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    unique: true,
  },
  token: {
    type: String,
  },

  /* CONFIG */
  created_at: {
    type: Date,
    default: defaultDate,
    expires: 3600, //1 jam
  },

  updated_at: {
    type: Date,
  },

  created_by: String,

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

const TokenVerifikasiDB = mongoose.model(
  "token-verifikasi",
  TokenVerifikasiSchema,
  "token-verifikasi"
);

module.exports = TokenVerifikasiDB;
