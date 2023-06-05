const express = require("express");
const Controller = require("../controllers/SipilCtrl");
const middleware = require("../middleware/Auth");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // Set the destination directory for uploaded files
const sipilRouter = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//POST: /api/v1/gallery-sipil
sipilRouter.post(
  "/",
  middleware.protect,
  upload.single("image"),
  Controller.create
);

//PATCH: /api/v1/gallery-sipil/:id
sipilRouter.patch(
  "/edit",
  middleware.protect,
  upload.single("image"),
  Controller.update
);

//DELETE: /api/v1/gallery-sipil
sipilRouter.delete("/", middleware.protect, upload.none(), Controller.delete);

//GET: /api/v1/gallery-sipil
sipilRouter.get("/", Controller.get);

//GET: /api/v1/gallery-sipil/detail/:id
sipilRouter.get("/detail/:id", Controller.detail);

module.exports = sipilRouter;
