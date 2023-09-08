const express = require("express");
const app = express();
const globalErrHandler = require("./middleware/globalErrHandler");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");
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
const userRouter = require("./routes/User");
const hotelRouter = require("./routes/Hotel");
const kamarRouter = require("./routes/Kamar");
const salesRouter = require("./routes/Sales");
const bookingRouter = require("./routes/Booking");

// Routes:
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hotel", hotelRouter);
app.use("/api/v1/kamar", kamarRouter);
app.use("/api/v1/sales", salesRouter);
app.use("/api/v1/booking", bookingRouter);

// Define a simple route handler to indicate that the server is running
app.use("/test", (req, res) => {
  res.send("Server is running");
});

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

// Start the server after establishing the database connection
sequelize
  .sync() // Sync all defined models with the database
  .then(() => {
    app.listen(PORT, console.log(`Server is up and running on ${PORT}`));
  })
  .catch((err) => {
    console.error("Database synchronization error:", err);
  });
