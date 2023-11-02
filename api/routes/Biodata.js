const express = require("express");
const Controller = require("../controllers/BiodataCtrl");
const middleware = require("../middleware/Auth");
const biodataRouter = express.Router();

//POST: /api/v1/users/register
biodataRouter.post("/create", middleware.protect, Controller.create);

module.exports = biodataRouter;
