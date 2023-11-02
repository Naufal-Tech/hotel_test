const express = require("express");
const app = express();

// Routes: Import and use various route modules
const userRouter = require("./User");
const hotelRouter = require("./Hotel");
const kamarRouter = require("./Kamar");
const salesRouter = require("./Sales");
const bookingRouter = require("./Booking");
const biodataRouter = require("./Biodata");
const userHotelRouter = require("./UserHotel");
const productRouter = require("./Product");
const customerRouter = require("./Customer");
const customerProductRouter = require("./CustomerProduct");
const cartItemRouter = require("./CartItem");
const followRouter = require("./Follow");

// Mount routes at specific paths
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hotel", hotelRouter);
app.use("/api/v1/kamar", kamarRouter);
app.use("/api/v1/sales", salesRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/biodata", biodataRouter);
app.use("/api/v1/user-hotel", userHotelRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/customer-product", customerProductRouter);
app.use("/api/v1/cart-item", cartItemRouter);
app.use("/api/v1/follow", followRouter);

module.exports = app;
