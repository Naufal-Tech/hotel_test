const express = require("express");
const Controller = require("../controllers/BookingCtrl");
const middleware = require("../middleware/Auth");
const bookingRouter = express.Router();

//POST: /api/v1/booking
bookingRouter.post("/", Controller.create);

//DELETE: /api/v1/booking
bookingRouter.delete("/", middleware.protect, Controller.delete);

//GET: /api/v1/booking
bookingRouter.get("/", middleware.protect, Controller.get);

//GET: /api/v1/booking
bookingRouter.get("/", middleware.protect, Controller.get);

//GET: /api/v1/booking/id
bookingRouter.get("/id", middleware.protect, Controller.searchIdBooking);

//GET: /api/v1/booking/email
bookingRouter.get("/email", middleware.protect, Controller.searchEmail);

//GET: /api/v1/booking/phone
bookingRouter.get("/phone", middleware.protect, Controller.searchPhone);

//GET: /api/v1/booking/layanan
bookingRouter.get("/service", middleware.protect, Controller.searchService);

//GET: /api/v1/booking/fullname
bookingRouter.get("/fullname", middleware.protect, Controller.searchFullname);

//PATCH: /api/v1/booking
bookingRouter.patch("/", middleware.protect, Controller.update);

module.exports = bookingRouter;
