const UserDB = require("./user.js");
const PostDB = require("./contactus.js");
const NewsletterDB = require("./newsletter.js");
const TokenVerifikasiDB = require("./tokenverifikasi.js");
const OtpUserDB = require("./otpuser");
const BookingDB = require("./booking");
const ContactUsDB = require("./contactus");

const models = {
  UserDB,
  PostDB,
  NewsletterDB,
  TokenVerifikasiDB,
  OtpUserDB,
  BookingDB,
  ContactUsDB,
};

module.exports = models;
