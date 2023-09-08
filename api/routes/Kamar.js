const express = require("express");
const Controller = require("../controllers/HotelKamarCtrl");
const kamarRouter = express.Router();

//POST: /api/v1/kamar
kamarRouter.post("/", Controller.add);

//PATCH: /api/v1/kamar/update
kamarRouter.patch("/update", Controller.update);

//DELETE: /api/v1/kamar/delete
kamarRouter.delete("/delete", Controller.delete);

//GET: /api/v1/users/kamar
kamarRouter.get("/detail/:id", Controller.detail);

//GET: /api/v1/kamar/
kamarRouter.get("/", Controller.get);

module.exports = kamarRouter;
