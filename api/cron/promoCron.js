const moment = require("moment");

async function checkingPromoExpired() {
  const now = moment().tz("Asia/Jakarta").toDate();

  try {
    const result = await models.PromoDB.updateMany(
      {
        end_date: { $lte: now },
        promo_status: { $ne: false },
      },
      {
        $set: { promo_status: false, updated_at: now },
      }
    );

    const numModified =
      result.modifiedCount !== undefined
        ? result.modifiedCount
        : result.matchedCount;

    if (numModified !== undefined && numModified > 0) {
      const updatedPromos = await models.PromoDB.find(
        {
          end_date: { $lte: now },
          promo_status: false,
        },
        { promo_title: 1 }
      );
      console.log(
        `Updated ${numModified} expired promotions to status 'false':`
      );
      updatedPromos.forEach((promo) => {
        console.log("Here is the titles of promo:", promo.promo_title);
      });
    } else {
      console.log(`No promotions were updated.`);
    }
  } catch (err) {
    console.error(`Error updating expired promotions: ${err}`);
  }
}

module.exports = { checkingPromoExpired };
