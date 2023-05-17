const express = require("express");
const Controller = require("../controllers/ApplicantCtrl");
const middleware = require("../middleware/Auth");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // Set the destination directory for uploaded files
const applicantRouter = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//POST: /api/v1/applicant
applicantRouter.post("/", upload.single("cv"), Controller.apply);

//DELETE: /api/v1/applicant
applicantRouter.delete("/", middleware.protect, Controller.delete);

//GET:  /api/v1/applicant
applicantRouter.get("/career", middleware.protect, Controller.jobApplicant);

//GET: /api/v1/applicant
applicantRouter.get("/", middleware.protect, Controller.get);

//GET: /api/v1/applicant/:id
applicantRouter.get("/detail/:id", middleware.protect, Controller.detail);

module.exports = applicantRouter;
