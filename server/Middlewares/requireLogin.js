const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
// const { JWT_SECRET } = require("../.env");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined. Please check your .env file.");
}

module.exports = (req, res, next) => {
  console.log("Request headers:", req.headers);

  const { authorization } = req.headers;
  if (!authorization) {
    console.log("Authorization header missing");
    return res.status(401).json({ error: "you must have loged in 1" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log("Token received:", token); // Debug: Log the token received by the server

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ error: "you must have loged in 2" });
    }
    // Log the decoded payload
    console.log("Decoded payload:", payload);

    const { _id } = payload;
    USER.findById(_id)

      .then((userData) => {
        if (!userData) {
          // console.error("User not found");
          return res.status(401).json({ error: "User not found" });
        }

        // Log the user data
        console.log("User data fetched:", userData);

        // Attach the user data to the request object
        req.user = userData;
        next();
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};
