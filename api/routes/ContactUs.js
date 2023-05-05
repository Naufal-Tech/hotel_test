const express = require("express");
const Controller = require("../controllers/ContactUsCtrl");
const middleware = require("../middleware/Auth");
const contactUsRouter = express.Router();

//POST: /api/v1/posts/create-post
contactUsRouter.post("/", Controller.addContactUs);

//POST: /api/v1/posts/
contactUsRouter.get("/", middleware.protect, Controller.get);

//DELETE: /api/v1/posts/
contactUsRouter.delete("/", middleware.protect, Controller.delete);

//GET: /api/v1/posts/:id
contactUsRouter.get("/detail/:id", middleware.protect, Controller.detail);

//PATCH: /api/v1/posts/:id
contactUsRouter.patch("/", middleware.protect, Controller.update);

module.exports = contactUsRouter;
