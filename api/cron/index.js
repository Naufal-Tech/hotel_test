const { checkingPromoExpired } = require("./promoCron");
const cron = require("node-cron");
const options = {
  scheduled: true,
  timezone: "Asia/Jakarta",
};

// checking for expired wishlists sehari
cron.schedule("0 0 * * *", checkingPromoExpired, options);

module.exports = { cron };
