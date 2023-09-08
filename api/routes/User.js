const express = require("express");
const Controller = require("../controllers/UserCtrl");
const middleware = require("../middleware/Auth");
const userRouter = express.Router();

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

//GET: /api/v1/users/view-profile
userRouter.get("/view-profile", middleware.protect, Controller.viewProfile);

module.exports = userRouter;
