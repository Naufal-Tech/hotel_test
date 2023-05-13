const express = require("express");
const Controller = require("../controllers/AddressCtrl");
const addressRouter = express.Router();

//GET: /api/v1/address
addressRouter.post("/", Controller.get);

module.exports = addressRouter;
