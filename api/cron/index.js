const { checkingPromoExpired } = require("./promoCron");
const cron = require("node-cron");
const options = {
  scheduled: true,
  timezone: "Asia/Jakarta",
};

// checking for expired wishlists sehari
cron.schedule("* * * * *", checkingPromoExpired, options);

module.exports = { cron };
