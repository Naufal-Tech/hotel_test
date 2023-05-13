const AddressController = {
  get: async function (req, res) {
    const { all_province, city, province, district, urban } = req.body;
    let filter = {},
      output = ``;

    if (all_province) {
      filter._id = { $ne: null };
      output = `province`;
    }
    if (province) {
      filter.province = province;
      output = `city`;
    }
    if (city) {
      filter.city = city;
      output = `district`;
    }
    if (district) {
      filter.district = district;
      output = `urban`;
    }
    if (urban) {
      filter.urban = urban;
      output = `postal_code`;
    }

    const address = await models.AddressDB.distinct(output, filter);
    return response.ok(address, res, `Success`);
  },
};

module.exports = AddressController;
