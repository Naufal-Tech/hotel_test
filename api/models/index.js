const UserDB = require("./user.js");
const PostDB = require("./contactus.js");
const NewsletterDB = require("./newsletter.js");
const TokenVerifikasiDB = require("./tokenverifikasi.js");
const OtpUserDB = require("./otpuser");
const BookingDB = require("./booking");
const ContactUsDB = require("./contactus");
const BulkEmailDB = require("./bulkemail");
const AddressDB = require("./address");
const CareerDB = require("./career");
const ApplicantDB = require("./applicant");
const TestimonialDB = require("./testimonial");

const models = {
  UserDB,
  PostDB,
  NewsletterDB,
  TokenVerifikasiDB,
  OtpUserDB,
  BookingDB,
  ContactUsDB,
  BulkEmailDB,
  AddressDB,
  CareerDB,
  ApplicantDB,
  TestimonialDB,
};

module.exports = models;
