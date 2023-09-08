const express = require("express");
const Controller = require("../controllers/SalesCtrl");
const salesRouter = express.Router();

//POST: /api/v1/sales
salesRouter.post("/", Controller.add);

//PATCH: /api/v1/sales/update
salesRouter.patch("/update", Controller.update);

//DELETE: /api/v1/sales/delete
salesRouter.delete("/delete", Controller.delete);

//GET: /api/v1/sales/delete
salesRouter.get("/detail/:id", Controller.detail);

//GET: /api/v1/sales/
salesRouter.get("/", Controller.get);

module.exports = salesRouter;
