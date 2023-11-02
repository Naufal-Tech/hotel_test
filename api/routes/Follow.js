const express = require("express");
const Controller = require("../controllers/FollowCtrl");
const middleware = require("../middleware/Auth");
const followRouter = express.Router();

//POST: /api/v1/users/register
followRouter.post("/", middleware.protect, Controller.follow);

module.exports = followRouter;
