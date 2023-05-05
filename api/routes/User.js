const express = require("express");
const Controller = require("../controllers/UserCtrl");
const middleware = require("../middleware/Auth");
const multer = require("multer");
const userRouter = express.Router();

// MULTER SET-UP:
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//POST: /api/v1/users/register
userRouter.post("/register", Controller.register);

//POST: /api/v1/users/login
userRouter.post("/login", Controller.login);

//PATCH: /api/v1/users/update
userRouter.patch("/update", middleware.protect, Controller.update);

//DELETE: /api/v1/users/delete
userRouter.delete("/delete", middleware.protect, Controller.delete);

//GET: /api/v1/users/delete
userRouter.get("/detail/:id", middleware.protect, Controller.detail);

//GET: /api/v1/users/
userRouter.get("/", middleware.protect, Controller.get);

//POST: /api/v1/users/forgot-password
userRouter.post("/forgot-password", Controller.forgotPassword);

//POST: /api/v1/users/verify-otp
userRouter.post("/verify-otp", Controller.verifikasiOTP);

//GET: /api/v1/users/verify
userRouter.get("/verify", Controller.emailVerification);

//POST: /api/v1/users/resend-verification
userRouter.post("/resend-verification", Controller.resendVerification);

//GET: /api/v1/users/username
userRouter.get("/username", middleware.protect, Controller.searchUsername);

//GET: /api/v1/users/fullname
userRouter.get("/fullname", Controller.searchByFullname);

//GET: /api/v1/users/email
userRouter.get("/email", Controller.searchByEmail);

//GET: /api/v1/users/update-password
userRouter.post(
  "/update-password",
  middleware.protect,
  Controller.updatePassword
);

//GET: /api/v1/users/update-password
userRouter.get("/view-profile", middleware.protect, Controller.viewProfile);

//POST/api/v1/users/:id
userRouter.post(
  "/img-profile",
  upload.single("img_profile"),
  middleware.protect,
  Controller.imgProfile
);

module.exports = userRouter;
