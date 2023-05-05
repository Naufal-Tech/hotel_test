const express = require("express");
const Controller = require("../controllers/NewsletterCtrl");
const middleware = require("../middleware/Auth");
const newsletterRouter = express.Router();

//POST: /api/v1/newsletter
newsletterRouter.post("/", Controller.newsletter);

//DELTE: /api/v1/newsletter
newsletterRouter.delete("/", middleware.protect, Controller.delete);

//DELTE: /api/v1/newsletter
newsletterRouter.get("/", middleware.protect, Controller.get);

module.exports = newsletterRouter;
