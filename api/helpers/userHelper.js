const createToken = async (user, organization_id, secret, expiresIn) => {
  const { _id } = user;
  return await jwt.sign({ _id, organization_id }, secret, {
    expiresIn, //set expire token
  });
};

const createTokenVerify = async (user, secret, expiresIn) => {
  const { _id } = user;
  return await jwt.sign({ _id }, secret, {
    expiresIn, //set expire token
  });
};

const userFirstLastName = (user) => {
  const user_name = user.name.split(" ");
  const first_name = user_name[0];
  const last_name = user.name.substring(
    user_name[0].length + 1,
    user.name.length
  );
  return { first_name, last_name };
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const verifyToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Get user from the token
    // const vendor = await models.VendorDB.findById(decoded.id).select('-password');
    const user = await models.UserDB.findById(decoded.id).select("-password");
    return { user };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const sendError = async (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      console.log(buffString);
      resolve(buffString);
    });
  });
};

function generateGuestId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);
  const guestId = `Guest-${year}${month}${day}${hours}${minutes}${seconds}`;

  return guestId;
}

function generateInvoiceId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const invoiceId = `INV${randomNum}-${year}${month}${day}-${hours}${minutes}${seconds}`;

  return invoiceId;
}

function generateTransactionId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const invoiceId = `TRF${randomNum}${year}${month}${day}${hours}${minutes}${seconds}`;

  return invoiceId;
}

// 4 Random Number
const generateOTP = (otp_length = 4) => {
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
};

// Validate Email
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

async function generateBookingId() {
  let code = "";
  let sequence = 0;
  let isUnique = false;

  while (!isUnique) {
    sequence++;
    code = sequence.toString().padStart(4, "0");

    // Check if the code already exists in the database
    const existingBooking = await models.BookingDB.findOne({
      bookingId: code,
    });

    if (!existingBooking) {
      isUnique = true;
    }
  }

  return code;
}

module.exports = {
  generateOTP,
  createToken,
  createTokenVerify,
  userFirstLastName,
  generateToken,
  verifyToken,
  sendError,
  generateRandomByte,
  generateGuestId,
  generateInvoiceId,
  generateTransactionId,
  validateEmail,
  generateBookingId,
};
