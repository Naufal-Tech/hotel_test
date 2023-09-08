const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Import your Sequelize User model

const middleware = {
  protect: async (req, res, next) => {
    try {
      // Extract token from headers
      const bearerHeader = req.headers.authorization;
      if (!bearerHeader) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Need Token Bearer" });
      }
      const token = bearerHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized decode.id" });
      }

      // Check for token expiration
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ error: "Token has expired" });
      }

      // Get user from the token using your Sequelize User model
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized There is no user" });
      }

      // Attach the user to the request for further use
      req.user = user;

      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError" && err.message === "jwt malformed") {
        return res.status(401).json({ error: "Invalid token" });
      } else if (
        err.name === "JsonWebTokenError" &&
        err.message === "invalid signature"
      ) {
        return res.status(401).json({ error: "Invalid signature" });
      } else {
        // Handle other errors here
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
      }
    }
  },
};

module.exports = middleware;
