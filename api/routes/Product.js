const express = require("express");
const Controller = require("../controllers/ProductCtrl");
const middleware = require("../middleware/Auth");
const productRouter = express.Router();

//POST: /api/v1/users/register
productRouter.post("/create", middleware.protect, Controller.create);

module.exports = productRouter;
