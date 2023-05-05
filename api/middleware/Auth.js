const middleware = {
  protect: async (req, res, next) => {
    try {
      // Extract token from headers
      const bearerHeader = req.headers.authorization;
      if (!bearerHeader) {
        return response.unauthorized(null, res, "Unauthorized");
      }
      const token = bearerHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return response.unauthorized(null, res, "Unauthorized");
      }

      // Check for token expiration
      if (decoded.exp < Date.now() / 1000) {
        return response.unauthorized(null, res, "Token has expired");
      }

      // Get user from the token
      req.user = await models.UserDB.findById(decoded.id).select("-password");
      if (!req.user) {
        return response.unauthorized(null, res, "Unauthorized");
      }

      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError" && err.message === "jwt malformed") {
        return response.unauthorized(null, res, "Invalid token");
      } else if (
        err.name === "JsonWebTokenError" &&
        err.message === "invalid signature"
      ) {
        return response.unauthorized(null, res, "Invalid signature");
      }
    }
  },
};

module.exports = middleware;
