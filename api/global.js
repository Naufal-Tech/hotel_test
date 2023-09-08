module.exports = function (global) {
  global.bcrypt = require("bcrypt");
  global.jwt = require("jsonwebtoken");
  global.express = require("express");
  global.moment = require("moment-timezone");
  global.response = require("./helpers/Response");
  global.middleware = require("./middleware/Auth");
  global.appErr = require("./utils/appErr");
  global.userHelper = require("./helpers/userHelper");
};
