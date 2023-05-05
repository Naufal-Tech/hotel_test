const { generateToken } = require("../helpers/userHelper");
const { generateOTP } = require("../helpers/userHelper");
const moment = require("moment-timezone");
const current_date = moment().tz("Asia/Jakarta").format();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { sendError } = require("../helpers/userHelper");

const UserController = {
  register: async function (req, res) {
    const { fullname, username, email, password, role } = req.body;

    if (!userHelper.validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // let img_profile = [];
    let emailTrim = email.trim();
    let usernameTrim = username.trim();

    const session = await models.UserDB.startSession();
    session.startTransaction();

    try {
      // VALIDASI EMAIL
      const existingEmail = await models.UserDB.findOne({
        email: { $regex: new RegExp(emailTrim, "i") },
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      if (existingEmail) {
        return response.error(
          400,
          `A user with the Email: '${emailTrim}' already exists`,
          res
        );
      }

      // VALIDASI USERNAME
      const words = usernameTrim.split(" ");
      if (words.length > 1) {
        return response.error(
          400,
          "Username cannot contain empty spaces in the middle",
          res
        );
      }

      const existingUsername = await models.UserDB.findOne({
        username: { $regex: new RegExp(usernameTrim, "i") },
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      if (existingUsername) {
        return response.error(
          400,
          `A user with username: '${usernameTrim}' already exists`,
          res
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Create User based on blue print database to write to database (TURUNAN DARI: orangExists)
      const user = await models.UserDB.create({
        fullname,
        username: usernameTrim,
        email: emailTrim,
        role: role,
        password: hashedPassword,
        // img_profile,
      });

      // Verifikasi BY LINK:
      // Generate a random verification token (Using Crypto)
      const verificationToken = crypto.randomBytes(20).toString("hex");

      // Save the verification token and user ID to TokenVerifikasiDB collection
      await models.TokenVerifikasiDB.create({
        user_id: user._id,
        token: verificationToken,
        created_at: Date.now(),
      });

      // create reusable transporter object using the configuration
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.SMTP_GMAIL,
        },
      });

      // Construct the email message with the user's password
      const passwordMailOptions = {
        from: process.env.GMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `New Staff has been created!`,
        html: `
    <p>A new staff has been created, here is the detail:</p>
    <p>Fullname: ${user.fullname}</p>
    <p>Email: ${user.email}</p>
    <p>Username: ${user.username}</p>
    <p>Role: ${user.role}</p>
    <p>Password: ${password}</p>
  `,
      };

      // Send the email message with the user's password to the admin email
      transporter.sendMail(passwordMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Password email sent: ${info.response}`);
        }
      });

      if (user) {
        //send respond user databack ke postman
        res.status(201).json({
          _id: user.id,
          username: user.username,
          email: user.email,
          slug: user.slug,
          fullname: user.fullname,
          // img_profile: user.img_profile,
        });
      } else {
        res.status(400);
        throw new Error("Invalid User Data"); //400 = bad request
      }
    } catch (error) {
      return response.error(400, error.message, res, error);
    } finally {
      if (session) {
        session.endSession();
      }
    }
  },

  login: async function (req, res) {
    const { emailOrUsername, password } = req.body;

    // Check if emailOrUsername and password fields are present
    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ error: "Both email/username and password are required" });
    }

    const session = await models.UserDB.startSession();
    session.startTransaction();

    try {
      // Check if user exists with email
      let user = await models.UserDB.findOne({ email: emailOrUsername }).select(
        "+password"
      );

      // Check if user exists with username if no email match found
      if (!user) {
        user = await models.UserDB.findOne({
          username: emailOrUsername,
        }).select("+password");
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken(user._id);

      // Respond with token
      response.ok(
        {
          token,
          user: {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            role: user.role,
            email: user.email,
          },
        },
        res,
        `Success`
      );
      // return response.ok(true, res, `Success`);
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      // Handle errors by aborting the transaction, ending the session, and returning a 500 error
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  delete: async function (req, res) {
    const { user_id } = req.body;
    const deletedTime = moment().tz("Asia/Jakarta").format();

    const filter = {
      _id: user_id,
      deleted_time: {
        $exists: false,
      },
    };

    const user = await models.UserDB.findOne(filter);
    if (!user) {
      return response.error(400, "User not found", res, "User not found");
    }

    // Check if the user is authorized to delete
    if (req.user.role === "Admin") {
      return response.error(
        401,
        "Unauthorized",
        res,
        "Admin cannot delete any user"
      );
    }

    if (req.user.role === "Master" || req.user.role === "Manager") {
      if (req.user._id === user_id) {
        return response.error(
          401,
          "Unauthorized",
          res,
          "Master or Manager cannot delete themselves"
        );
      }
    } else {
      return response.error(401, "Unauthorized", res);
    }

    const session = await models.UserDB.startSession();
    session.startTransaction();

    try {
      const options = { session };

      await models.UserDB.findByIdAndUpdate(
        user_id,
        { deleted_time: deletedTime, deleted_by: req.user._id },
        options
      );

      await session.commitTransaction();
      session.endSession();

      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  update: async function (req, res) {
    let {
      user_id,
      fullname,
      username,
      password,
      role,
      // img_profile,
    } = req.body;

    let usernameTrim = username.trim();

    // Start a session
    const session = await models.UserDB.startSession();
    session.startTransaction();

    try {
      // Find the `User` document to update
      const user = await models.UserDB.findOne({
        _id: user_id,
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!user) {
        return response.error(404, "User not found", res);
      }

      // Check if the user is authorized to update
      if (req.user.role !== "Master" && req.user._id != user_id) {
        return response.error(401, "Unauthorized", res);
      }

      // VALIDASI USERNAME
      const words = usernameTrim.split(" ");
      if (words.length > 1) {
        return response.error(
          400,
          "Username cannot contain empty spaces in the middle",
          res
        );
      }

      const existingUsername = await models.UserDB.findOne({
        username: { $regex: new RegExp(usernameTrim, "i") },
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
        _id: { $ne: user._id }, // add this condition to exclude the current user
      });

      if (existingUsername) {
        return response.error(
          400,
          `A user with username: '${usernameTrim}' already exists`,
          res
        );
      }

      // Check if the user is authorized to update
      if (req.user.role === "Admin" && req.user._id != user_id) {
        return response.error(
          401,
          "Unauthorized",
          res,
          "Admin cannot update any user"
        );
      }

      // Allow users with "Master" role to update
      if (req.user.role === "Master") {
        user.fullname = fullname;
        user.username = usernameTrim;
        user.role = role;
        user.password = bcrypt.hashSync(password, 10);
        user.updated_by = req.user._id;
        user.updated_at = current_date;
        // user.img_profile = img_profile;
      } else {
        // If not "Master" role, only update name and username
        user.fullname = fullname;
        user.username = usernameTrim;
        user.updated_by = req.user._id;
        user.updated_at = current_date;
      }

      // Save the updated document
      const options = { session };
      await models.UserDB(user).save(options);

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.SMTP_GMAIL,
        },
      });

      // Construct the email message with the user's password
      const passwordMailOptions = {
        from: process.env.GMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "A User Has Updated Their Profile",
        html: `
      <p>A New User has Updated Their Profile, here is the detail:</p>
      <p>Fullname: ${user.fullname}</p>
      <p>Email: ${user.email}</p>
      <p>Username: ${user.username}</p>
      <p>Role: ${user.role}</p>
      <p>Password: ${password}</p>
    `,
      };

      // Send the email message with the user's password to the admin email
      transporter.sendMail(passwordMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Password email sent: ${info.response}`);
        }
      });

      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  detail: async function (req, res) {
    const { id } = req.params;

    try {
      const user = await models.UserDB.findOne({
        _id: id,
        role: { $ne: "Master" },
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
      });

      if (!user) {
        return response.error(404, "User not found", res);
      }

      return response.ok(user, res, "Successfully retrieved user");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  // viewProfile: async (req, res, next) => {
  //   try {
  //     // Find the user whose profile is being viewed
  //     // const viewedUser = await UserDB.findById(req.params.id);

  //     const { id } = req.body;

  //     // Find the user whose profile is being viewed
  //     const viewedUser = await models.UserDB.findById(id);

  //     // Find the user who is viewing the profile
  //     const viewingUser = await models.UserDB.findById(req.user._id);

  //     // Check if both users were found
  //     if (viewedUser && viewingUser) {
  //       // Check if the viewing user has already viewed the profile
  //       const existingView = viewedUser.viewers.find(
  //         (viewer) => viewer.user.toString() === viewingUser._id.toString()
  //       );

  //       if (existingView) {
  //         // If the viewing user has already viewed the profile, update the timestamp
  //         existingView.lastViewed = current_date;
  //       } else {
  //         // If the viewing user has not yet viewed the profile, add a new entry to the viewers array
  //         viewedUser.viewers.push({
  //           user: viewingUser._id,
  //           lastViewed: current_date,
  //         });
  //       }

  //       // Save the changes to the viewed user's document
  //       await viewedUser.save();

  //       // Return a success response
  //       res.json({
  //         status: "You have successfully viewed this profile",
  //         data: viewedUser,
  //       });
  //     }
  //   } catch (error) {
  //     // If an error occurs, return an error response
  //     next(appErr.appErr(error.message));
  //   }
  // },

  viewProfile: async (req, res, next) => {
    try {
      const { id } = req.body;

      // Find the user whose profile is being viewed
      const viewedUser = await models.UserDB.findById(id);

      // Find the user who is viewing the profile
      const viewingUser = await models.UserDB.findById(req.user._id);

      // Check if both users were found
      if (viewedUser && viewingUser) {
        // Check if the viewed user is the same as the viewing user
        if (viewedUser._id.toString() === viewingUser._id.toString()) {
          // If the viewed user is the same as the viewing user, return the profile without updating the viewers array
          return res.json({
            status: "success",
            data: viewedUser,
          });
        }

        // Check if the viewing user has already viewed the profile
        const existingView = viewedUser.viewers.find(
          (viewer) => viewer.user.toString() === viewingUser._id.toString()
        );

        // Get the current date and time in the Asia/Jakarta timezone
        const current_date = moment().tz("Asia/Jakarta").format();

        if (existingView) {
          // If the viewing user has already viewed the profile, update the timestamp
          existingView.lastViewed = current_date;
        } else {
          // If the viewing user has not yet viewed the profile, add a new entry to the viewers array
          viewedUser.viewers.push({
            user: viewingUser._id,
            lastViewed: current_date,
          });
        }

        // Save the changes to the viewed user's document
        await viewedUser.save();

        // Return a success response
        res.json({
          status: "success",
          data: viewedUser,
        });
      }
    } catch (error) {
      // If an error occurs, return an error response
      next(appErr.appErr(error.message));
    }
  },

  get: async function (req, res) {
    try {
      const users = await models.UserDB.find({
        deleted_by: { $exists: false },
        deleted_time: { $exists: false },
        role: { $ne: "Master" }, // Exclude users with a role of Master
      });
      return response.ok(users, res, "Successfully retrieved all users");
    } catch (err) {
      return response.error(400, err.message, res, err);
    }
  },

  forgotPassword: async function (req, res) {
    const { email } = req.body;
    const user = await models.UserDB.findOne({
      email: email,
      deleted_by: { $exists: false },
      deleted_time: { $exists: false },
    });

    if (!user) {
      return response.error(404, "User not found", res);
    }

    // generate 6 digit otp
    let OTP = generateOTP();

    // store otp inside our db
    const newOTP = await models.OtpUserDB.create({
      user_id: user._id,
      otp: OTP,
    });

    await newOTP.save();

    // create reusable transporter object using the configuration
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.SMTP_GMAIL,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: user.email,
      subject: "OTP for Reset Password",
      html: `
      <p>Your OTP for reset password</p>
      <h1>${OTP}</h1>
    `,
    };

    const forgotPassword = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${forgotPassword}`);

    res.json({
      message: "New OTP has been sent to your registered email account.",
      userId: user._id,
    });
  },

  verifikasiOTP: async function (req, res) {
    const { user_id, otp, new_password } = req.body;

    if (!user_id || !otp || !new_password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await models.UserDB.findById({ _id: user_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = await models.OtpUserDB.findOne({ user_id });
    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }

    const isMatched = await bcrypt.compare(otp, token.otp);
    if (!isMatched) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    //Delete the token from OtpUserDB
    await models.OtpUserDB.findByIdAndDelete(token._id);

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.SMTP_GMAIL,
      },
    });

    // Construct the email message with the user's password
    const passwordMailOptions = {
      from: process.env.GMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "A User has forgot the password",
      html: `
    <p>A New User has successfully reset the password!</p>
    <p>Fullname: ${user.fullname}</p>
    <p>Email: ${user.email}</p>
    <p>Username: ${user.username}</p>
    <p>Password: ${new_password}</p>
    <p>Role: ${user.role}</p>
  `,
    };

    // Send the email message with the user's password to the admin email
    transporter.sendMail(passwordMailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Password email sent: ${info.response}`);
      }
    });

    res.json({ message: "Password has been reset" });
  },

  resetPassword: async function (req, res) {
    const { token, password } = req.body;

    const user = await models.UserDB.findOne({ resetPasswordLink: token });
    // console.log(user)
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.SMTP_GMAIL,
      },
    });

    // Construct the email message with the user's password
    const passwordMailOptions = {
      from: process.env.GMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "A User Has Updated Their Profile",
      html: `
    <p>A New User has Updated Their Profile on My Blog!</p>
    <p>Email: ${user.email}</p>
    <p>Username: ${user.username}</p>
    <p>Password: ${password}</p>
  `,
    };

    // Send the email message with the user's password to the admin email
    transporter.sendMail(passwordMailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Password email sent: ${info.response}`);
      }
    });

    if (user) {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      await user.save();
      return res.status(201).json({
        status: true,
        message: "Password Berhasil Diganti",
      });
    }
  },

  verifyEmail: async function (req, res) {
    try {
      const { user_id, otp } = req.body;

      if (!user_id) return res.json({ error: "Invalid user!" });

      const user = await models.UserDB.findById({ _id: user_id });
      if (!user) return sendError(res, "User not found!", 404);

      if (user.isVerified) return sendError(res, "User is Already Verified!");

      const token = await models.OtpUserDB.findOne({ user_id: user_id });
      if (!token) return sendError(res, "Token not found!");

      if (!bcrypt.compareSync(otp, token.otp))
        return sendError(res, "Invalid OTP");

      user.isVerified = true;
      await user.save();

      await models.OtpUserDB.findByIdAndDelete(token._id);

      const mailOptions = {
        from: process.env.USER,
        to: user.email,
        subject: "Welcome to Our App",
        html: `<p>Thanks for choosing us!</p>`,
      };

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.SMTP_GMAIL,
        },
      });

      transporter.sendMail(mailOptions);

      res.json({ message: "Your email is verified." });
    } catch (error) {
      console.log(error);
      return sendError(res, "Invalid user id!");
    }
  },

  emailVerification: async function (req, res) {
    const { user_id, token } = req.query;

    // Look up the corresponding document in the TokenVerifikasiDB collection
    const verificationTokenDoc = await models.TokenVerifikasiDB.findOne({
      user_id,
      token,
    });

    if (!verificationTokenDoc) {
      // Matching with the existing document on TokenVerifikasiDB
      return res.send("Invalid verification link. Please try again.");
    }

    // Update the users document and mark as verified (looking ID user on UserDB and matching with user_id on TokenVerifikasiDB)
    await models.UserDB.findByIdAndUpdate(user_id, { isVerified: true });

    // Delete the verification token document from the TokenVerifikasiDB collection
    await verificationTokenDoc.deleteOne();

    // Redirect the user to a success page or display a success message
    // res.send("Your email address has been successfully verified!");

    // Redirect the user to the frontend login page or another page
    res.redirect("https://yourfrontendapp.com/login");
  },

  resendVerification: async function (req, res) {
    const { email } = req.body;

    const user = await models.UserDB.findOne({ email });
    if (!user) return sendError(res, "User not found!");

    console.log("Ini ID USER", user._id);

    if (user.isVerified) {
      return sendError(res, "This email id is already verified!");
    }

    const alreadyHasToken = await models.TokenVerifikasiDB.findOne({
      user_id: user._id,
    });

    if (alreadyHasToken) {
      await models.TokenVerifikasiDB.findByIdAndDelete(alreadyHasToken._id);
    }

    // Verifikasi BY LINK:
    // Generate a random verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the verification token and user ID to TokenVerifikasiDB collection
    const newEmailVerificationToken = await models.TokenVerifikasiDB.create({
      user_id: user._id,
      token: verificationToken,
      created_at: Date.now(),
    });

    await newEmailVerificationToken.save();

    // Construct the verification link
    const verificationLink = `http://localhost:4000/api/v1/users/verify?user_id=${user._id}&token=${verificationToken}`;

    // create reusable transporter object using the configuration
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.SMTP_GMAIL,
      },
    });

    // Construct the email message with the verification link
    const mailOptions = {
      from: process.env.GMAIL,
      to: user.email,
      subject: "Please Verify Your Email",
      html: `
       <p>Thank you for registering to My Blog!</p>
       <p>Please click the link below to verify your email:</p>
       <a href="${verificationLink}">${verificationLink}</a>
   `,
    };

    // Send the email message
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    // Send the email message
    // const emailResponse = await transporter.sendMail(mailOptions);
    // console.log(`Email sent: ${emailResponse.response}`);

    res.json({
      message:
        "New Link Verification has been sent to your registered email accout.",
    });
  },

  searchUsername: async function (req, res) {
    try {
      const username = req.query.username;
      const user = await models.UserDB.findOne({
        username: username,
        role: { $ne: "Master" },
      });
      if (!user) return response.error(404, `User not found`, res);
      return response.ok(user, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  searchByFullname: async function (req, res) {
    try {
      const slug = req.query.fullname;
      const user = await models.UserDB.findOne({
        slug: slug,
        role: { $ne: "Master" },
      });
      if (!user) return response.error(404, `User not found`, res);
      return response.ok(user, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  searchByEmail: async function (req, res) {
    try {
      const email = req.query.email;
      const user = await models.UserDB.findOne({
        email: email,
        role: { $ne: "Master" },
      });
      if (!user) return response.error(404, `User not found`, res);
      return response.ok(user, res, `Success`);
    } catch (error) {
      return response.error(400, error.message, res, error);
    }
  },

  updatePassword: async function (req, res) {
    let { user_id, old_password, new_password, confirm_password } = req.body;

    // const user_id = req.user._id; // get the user id from the token

    // Start a session
    const session = await models.UserDB.startSession();
    session.startTransaction();

    try {
      // Find the `User` document to update
      const user = await models.UserDB.findOne({
        _id: user_id,
        deleted_time: { $exists: false },
        deleted_by: { $exists: false },
      });

      if (!user) {
        return response.error(404, "User not found", res);
      }

      // Validation that only the user can update their own profile based on the token
      if (req.user.role !== "Master" && req.user._id != user_id) {
        return response.error(401, "Unauthorized", res);
      }

      // Validate new password is not the same as the old password
      if (old_password && new_password && confirm_password) {
        // Check if old password matches
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
          return response.error(400, "Invalid old password", res);
        }

        // Check if new password and confirm password match
        if (new_password === old_password) {
          return response.error(
            400,
            "New password cannot be the same as the old password",
            res
          );
        }

        if (new_password !== confirm_password) {
          return response.error(
            400,
            "New password and confirm password do not match",
            res
          );
        }

        user.password = bcrypt.hashSync(new_password, 10);
      }

      // Save the updated document
      const options = { session };
      await models.UserDB(user).save(options);

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.SMTP_GMAIL,
        },
      });

      // Construct the email message with the user's password
      const passwordMailOptions = {
        from: process.env.GMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "User: Reset Password",
        html: `
      <p>A New User has successfully reset the password:</p>
      <p>Email: ${user.email}</p>
      <p>Username: ${user.username}</p>
      <p>Password: ${new_password}</p>
    `,
      };

      // Send the email message with the user's password to the admin email
      transporter.sendMail(passwordMailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Password email sent: ${info.response}`);
        }
      });

      await session.commitTransaction();
      session.endSession();
      return response.ok(true, res, `Success`);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return response.error(400, err.message, res, err);
    }
  },

  imgProfile: async function (req, res, next) {
    try {
      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      });

      //1. Find the user to be updated
      const userPhoto = await models.UserDB.findById(req.user._id);

      console.log(userPhoto);

      //2. check if user is found
      if (!userPhoto) {
        return next(appErr.appErr("User not found", 403));
      }

      //4. Check if a user is updating their photo
      if (req.file) {
        // Upload the image file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "blog-react", // Specify a folder to store the image in (optional)
        });

        console.log(req.file);

        // Update the user's profile photo URL with the Cloudinary URL
        userPhoto.img_profile = result.secure_url;

        // Save the updated user document to the database
        await userPhoto.save();

        // Return a success response
        res.json({
          status: "You have successfully updated your profile photo",
          data: userPhoto.img_profile,
        });
      }
    } catch (error) {
      next(appErr.appErr(error.message, 500));
    }
  },
};

module.exports = UserController;
