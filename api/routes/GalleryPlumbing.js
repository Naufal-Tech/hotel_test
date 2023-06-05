const express = require("express");
const Controller = require("../controllers/PlumbingCtrl");
const middleware = require("../middleware/Auth");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // Set the destination directory for uploaded files
const plumbingRouter = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//POST: /api/v1/gallery-plumbing
plumbingRouter.post(
  "/",
  middleware.protect,
  upload.single("image"),
  Controller.create
);

//PATCH: /api/v1/gallery-plumbing/:id
plumbingRouter.patch(
  "/edit",
  middleware.protect,
  upload.single("image"),
  Controller.update
);

//DELETE: /api/v1/gallery-plumbing
plumbingRouter.delete(
  "/",
  middleware.protect,
  upload.none(),
  Controller.delete
);

//GET: /api/v1/gallery-plumbing
plumbingRouter.get("/", Controller.get);

//GET: /api/v1/gallery-plumbing/detail/:id
plumbingRouter.get("/detail/:id", Controller.detail);

module.exports = plumbingRouter;
