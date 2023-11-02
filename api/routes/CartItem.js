const express = require("express");
const Controller = require("../controllers/CartItemCtrl");
const middleware = require("../middleware/Auth");
const cartItemRouter = express.Router();

//POST: /api/v1/users/register
cartItemRouter.post("/create", Controller.create);

module.exports = cartItemRouter;
