const express = require("express");
const Controller = require("../controllers/BookingCtrl");
const middleware = require("../middleware/Auth");
const bookingRouter = express.Router();

//POST: /api/v1/comment/create
bookingRouter.post("/", Controller.create);

//DELETE: /api/v1/comment/delete
bookingRouter.delete("/", Controller.delete);

//GET: /api/v1/comment
bookingRouter.get("/", Controller.get);

//PATCH: /api/v1/comment/edit
bookingRouter.patch("/", Controller.update);

module.exports = bookingRouter;
