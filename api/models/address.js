const defaultDate = moment.tz(Date.now(), "Asia/Jakarta");

const addressSchema = new mongoose.Schema({
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  urban: {
    type: String,
  },
  city: {
    type: String,
  },
  postal_code: {
    type: String,
  },
  created_at: {
    type: Date,
    default: defaultDate,
  },
  created_by: String,
  updated_at: Date,
  updated_by: String,
  deleted_time: Date,
  deleted_by: String,
});

const AddressDB = mongoose.model("address", addressSchema, "address");

module.exports = AddressDB;
