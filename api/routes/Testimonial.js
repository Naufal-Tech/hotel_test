const express = require("express");
const Controller = require("../controllers/TestimonialCtrl");
const middleware = require("../middleware/Auth");
const testimonialRouter = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//POST: /api/v1/bulkemail
testimonialRouter.post(
  "/",
  upload.single("picture"),
  middleware.protect,
  Controller.create
);

//DELTE: /api/v1/bulkemail
testimonialRouter.delete("/", middleware.protect, Controller.delete);

//PUT: /api/v1/career
testimonialRouter.patch(
  "/",
  upload.single("picture"),
  middleware.protect,
  Controller.update
);

//GET: /api/v1/career
testimonialRouter.get("/", Controller.get);

//GET: /api/v1/career/detail
testimonialRouter.get("/detail/:id", Controller.detail);

module.exports = testimonialRouter;
