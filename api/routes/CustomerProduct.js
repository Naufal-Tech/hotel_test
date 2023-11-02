const express = require("express");
const Controller = require("../controllers/CustomerProductCtrl");
const middleware = require("../middleware/Auth");
const customerProductRouter = express.Router();

//POST: /api/v1/users/register
customerProductRouter.post("/create", middleware.protect, Controller.create);

module.exports = customerProductRouter;
