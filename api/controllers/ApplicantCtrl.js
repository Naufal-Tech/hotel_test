const cloudinary = require("cloudinary").v2;
const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const ApplicantController = {
  apply: async function (req, res) {
    const {
      job_id,
      name,
      domicile,
      age,
      latest_education,
      major,
      skill,
      contact_phone,
      email,
    } = req.body;

    // Check if all fields are present
    if (
      !job_id ||
      !name ||
      !domicile ||
      !age ||
      !latest_education ||
      !major ||
      !skill ||
      !contact_phone ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    if (!userHelper.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid email address",
        error: "Invalid email address",
      });
    }

    try {
      // Validate file extension
      if (req.file) {
        const allowedExtensions = ["pdf", "docx", "doc"];
        const fileExtension = req.file.originalname
          .split(".")
          .pop()
          .toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          return res.status(400).json({
            success: false,
            status: 400,
            message:
              "Invalid file extension. Only PDF, DOCX and DOC files are allowed.",
          });
        }
      }

      // Upload CV to Cloudinary
      let cvUrl;

      if (req.file) {
        // Upload CV file to Cloudinary
        const cvResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "AMERTA_CANDIDATE",
          resource_type: "auto",
        });
        cvUrl = cvResult.secure_url;
      } else {
        // Check if the 'cv' field is missing
        if (!req.body.cv) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "A CV file is required",
          });
        }
        cvUrl = req.body.cv;
      }

      // Create the applicant record
      const applicant = await models.ApplicantDB.create({
        name,
        domicile,
        age,
        latest_education,
        major,
        skill,
        job_id,
        contact_phone,
        email,
        cv: cvUrl,
        created_at: current_date,
      });

      // Find the career/job in CareerDB
      const career = await models.CareerDB.findById(job_id);

      if (!career) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Job not found",
        });
      }

      // Check if the applicant's email already exists in the applicant_id array
      const isAlreadyApplied = career.applicant_id.some(
        (applicantEmail) => applicantEmail === email
      );

      if (isAlreadyApplied) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "You already applied for this job",
        });
      }

      // Push the applicant's email to the applicant_id field in CareerDB
      career.applicant_id.push(email);
      await career.save();

      // Return the success response
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Applicant record created successfully",
        data: applicant,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while creating the applicant record",
        error: error.message,
      });
    }
  },

  delete: async function (req, res) {
    const { applicant_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: applicant_id,
      deleted_time: {
        $exists: false,
      },
      deleted_by: {
        $exists: false,
      },
    };

    const applicant = await models.ApplicantDB.findOne(filter);
    if (!applicant) {
      return response.error(
        400,
        "Applicant not found",
        res,
        "Applicant not found"
      );
    }

    // Check user's role
    if (req.user.role !== "Master" && req.user.role !== "Manager") {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    const session = await models.ApplicantDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      await models.ApplicantDB.findByIdAndUpdate(
        applicant_id,
        { deleted_time: deletedTime, deleted_by: req.user._id },
        options
      );

      // Find all career/job records that contain the applicant's email in the applicant_id field
      const careers = await models.CareerDB.find({
        applicant_id: applicant.email,
      });

      for (const career of careers) {
        // Pull the applicant's email from the applicant_id field in each CareerDB record
        career.applicant_id.pull(applicant.email);
        await career.save();
      }

      await session.commitTransaction();
      session.endSession();

      return response.ok(true, res, "Success");
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  get: async function (req, res) {
    try {
      const applicant = await models.ApplicantDB.find({
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });
      return response.ok(
        applicant,
        res,
        "Successfully retrieved All Applicants"
      );
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const applicant = await models.ApplicantDB.findOne({
        _id: id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!applicant) {
        return response.error(404, "Career Not Found", res);
      }

      return response.ok(
        applicant,
        res,
        "Successfully Retrieved The Applicant"
      );
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  jobApplicant: async function (req, res) {
    const { job_id } = req.body;

    try {
      // Find the career/job in CareerDB
      const career = await models.CareerDB.findById(job_id);

      if (!career) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Job not found",
        });
      }

      // Retrieve the applicants based on the applicant_id field in CareerDB
      const applicants = await models.ApplicantDB.find({
        email: { $in: career.applicant_id },
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Successfully retrieved all applicants for the job",
        data: applicants,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "An error occurred while retrieving the applicants",
        error: error.message,
      });
    }
  },
};

module.exports = ApplicantController;
