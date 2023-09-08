const express = require("express");
const Controller = require("../controllers/BookingCtrl");
const bookingRouter = express.Router();

//POST: /api/v1/booking
bookingRouter.post("/", Controller.add);

//PATCH: /api/v1/booking/update
// bookingRouter.patch("/update", Controller.update);

//DELETE: /api/v1/booking/delete
bookingRouter.delete("/delete", Controller.delete);

//GET: /api/v1/booking/detail/:id
bookingRouter.get("/detail/:id", Controller.detail);

//GET: /api/v1/booking
bookingRouter.get("/", Controller.get);

module.exports = bookingRouter;
