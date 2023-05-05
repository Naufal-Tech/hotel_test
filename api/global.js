module.exports = function (global) {
  global.bcrypt = require("bcrypt");
  global.jwt = require("jsonwebtoken");
  global.nodemailer = require("nodemailer");
  global.crypto = require("crypto");
  global.express = require("express");
  global.mongoose = require("mongoose");
  global.moment = require("moment-timezone");
  global.qs = require("qs");
  global.fs = require("fs");
  global.models = require("./models/index");
  global.response = require("./helpers/Response");
  global.middleware = require("./middleware/Auth");
  global.slugify = require("slugify");
  global.appErr = require("./utils/appErr");
  global.cloudinary = require("cloudinary").v2;
  global.userHelper = require("./helpers/userHelper");
};
