const express = require("express");
const Controller = require("../controllers/UserHotelCtrl");
const middleware = require("../middleware/Auth");
const userHotelRouter = express.Router();

// POST: /api/v1/user-hotel/create
userHotelRouter.post("/create", middleware.protect, Controller.create);

// GET: /api/v1/user-hotel
userHotelRouter.get("/", middleware.protect, Controller.get);

// DELETE: /api/v1/user-hotel/delete
userHotelRouter.delete("/delete", middleware.protect, Controller.delete);

// RESTORE: /api/v1/user-hotel/restore
userHotelRouter.patch("/restore", Controller.restore);

// GET: /api/v1/users/delete
userHotelRouter.get("/detail/:id", middleware.protect, Controller.detail);

module.exports = userHotelRouter;
