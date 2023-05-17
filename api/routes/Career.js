const express = require("express");
const Controller = require("../controllers/CareerCtrl");
const middleware = require("../middleware/Auth");
const careerRouter = express.Router();

//POST: /api/v1/bulkemail
careerRouter.post("/", middleware.protect, Controller.create);

//DELTE: /api/v1/bulkemail
careerRouter.delete("/", middleware.protect, Controller.delete);

//PUT: /api/v1/career
careerRouter.patch("/", middleware.protect, Controller.update);

//GET: /api/v1/career
careerRouter.get("/", Controller.get);

//GET: /api/v1/career/detail
careerRouter.get("/detail/:id", Controller.detail);

module.exports = careerRouter;
