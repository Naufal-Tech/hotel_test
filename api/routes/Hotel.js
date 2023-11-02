const express = require("express");
const Controller = require("../controllers/HotelCtrl");
const hotelRouter = express.Router();
const middleware = require("../middleware/Auth");

//POST: /api/v1/hotel
hotelRouter.post("/", middleware.protect, Controller.add);

//PATCH: /api/v1/hotel/update
hotelRouter.patch("/update", Controller.update);

//DELETE: /api/v1/hotel/delete
hotelRouter.delete("/delete", Controller.delete);

//GET: /api/v1/hotel/delete
hotelRouter.get("/detail/:id", Controller.detail);

//GET: /api/v1/hotel/
hotelRouter.get("/", Controller.get);

module.exports = hotelRouter;
