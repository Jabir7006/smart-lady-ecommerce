require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJwt = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = createJwt;
