const express = require("express");
const Controller = require("../controllers/NewsletterCtrl");
const newsletterRouter = express.Router();

//POST: /api/v1/category/create-category
newsletterRouter.post("/", Controller.newsletter);

module.exports = newsletterRouter;
