const express = require("express");
const app = express();
const { globalErrHandler } = require("./middleware/globalErrHandler");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");
const dotenv = require("dotenv");
const routes = require("./routes/index");
dotenv.config();

/*** Global Variable ***/
require(`./global`)(global);

// Middlewares
app.use(express.json());

// Setting up bodyParser:
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SETTING CORS: Configure Cross-Origin Resource Sharing (CORS)
app.use(cors()); // Enable CORS for all routes
app.options("*", cors());

// CORS Headers: Define CORS headers for all routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, PATCH"); // Allow specified HTTP methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// All Routes Here:
app.use("/", routes);

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
