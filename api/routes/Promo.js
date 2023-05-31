const express = require("express");
const Controller = require("../controllers/PromoCtrl");
const middleware = require("../middleware/Auth");
const promoRouter = express.Router();
const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // Set the destination directory for uploaded files
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//POST: /api/v1/promo
promoRouter.post(
  "/",
  upload.single("promo_img"),
  middleware.protect,
  Controller.create
);

//DELTE: /api/v1/promo
promoRouter.delete("/", upload.none(), middleware.protect, Controller.delete);

//PUT: /api/v1/promo
promoRouter.patch(
  "/",
  upload.single("promo_img"),
  middleware.protect,
  Controller.update
);

//GET: /api/v1/promo
promoRouter.get("/", Controller.get);

//GET: /api/v1/promo/detail
promoRouter.get("/detail/:id", Controller.detail);

module.exports = promoRouter;
