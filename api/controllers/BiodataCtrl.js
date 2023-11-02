const { Biodata, Sequelize } = require("../models");
const { Op } = require("sequelize");

const BiodataController = {
  create: async function (req, res) {
    try {
      // Parse the request body to get the data for the Biodata record
      const { birthdate, self_description, hobbies } = req.body;

      // Create a new Biodata record
      const biodata = await Biodata.create({
        birthdate,
        self_description,
        hobbies,
        created_at: new Date(),
        created_by: req.user.id,
      });

      return res.status(201).json(biodata); // Respond with the created Biodata record
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating Biodata" });
    }
  },
};

module.exports = BiodataController;
