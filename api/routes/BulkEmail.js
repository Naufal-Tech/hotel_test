const express = require("express");
const Controller = require("../controllers/BulkEmailCtrl");
const middleware = require("../middleware/Auth");
const bulkEmailRouter = express.Router();

//POST: /api/v1/bulkemail
bulkEmailRouter.post("/", middleware.protect, Controller.bulkEmail);

//DELTE: /api/v1/bulkemail
bulkEmailRouter.delete("/", middleware.protect, Controller.delete);

//GET: /api/v1/bulkemail
bulkEmailRouter.get("/", middleware.protect, Controller.get);

//GET: /api/v1/bulkmail
bulkEmailRouter.get("/subject", middleware.protect, Controller.searchSubject);

module.exports = bulkEmailRouter;
