const express = require("express");
const app = express();
const globalErrHandler = require("./middleware/globalErrHandler");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

/*** Global Variable ***/
require(`./global`)(global);

//middlewares
app.use(express.json()); //pass incoming payload

// Setting up bodyParser:
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SETTING CORS:
app.use(cors());
app.options("*", cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes:
const bookingRouter = require("./routes/Booking");
const userRouter = require("./routes/User");
const contactUsRouter = require("./routes/ContactUs");
const bulkEmailRouter = require("./routes/BulkEmail");
const addressRouter = require("./routes/Address");
const newsletterRouter = require("./routes/Newsletter");
const careerRouter = require("./routes/Career");
const applicantRouter = require("./routes/Applicant");
const testimonialRouter = require("./routes/Testimonial");

// Routes:
app.use("/api/v1/newsletter", newsletterRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/contact-us", contactUsRouter);
app.use("/api/v1/bulkemail", bulkEmailRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/career", careerRouter);
app.use("/api/v1/applicant", applicantRouter);
app.use("/api/v1/testimonial", testimonialRouter);

// Setting Path:
app.use("/images", express.static(path.join(__dirname, "./images")));

// Database Connection:
try {
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }); //tidak deprecated
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error")); //tanya
  db.once("open", function (callback) {
    console.log("\n\n\n\n");
    console.log(
      `Server successfully compiled on ${moment().format(
        `YYYY-MM-DD HH:mm:ss`
      )} \nDatabase connection Success with port ${
        process.env.PORT
      }!\nConnect to MongDB Atlas\n\n\n\n\n`
    );
  });
} catch (error) {
  atlas();
}

// Define a simple route handler to indicate that the server is running
app.use("/test", (req, res) => {
  res.send("Server is running");
});

// Mount bulk email router
app.use("/api/v1/bulkemail", bulkEmailRouter);

//Error handlers middleware
app.use(globalErrHandler);

//404 error
app.use("*", (req, res) => {
  console.log(req.originalUrl);
  res.status(404).json({
    message: `${req.originalUrl} - Route Not Found`,
  });
});

//Listen to server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is up and running on ${PORT}`));
