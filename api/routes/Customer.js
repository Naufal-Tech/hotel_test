const express = require("express");
const Controller = require("../controllers/CustomerCtrl");
const middleware = require("../middleware/Auth");
const customerRouter = express.Router();

//POST: /api/v1/users/register
customerRouter.post("/create", middleware.protect, Controller.create);

module.exports = customerRouter;
