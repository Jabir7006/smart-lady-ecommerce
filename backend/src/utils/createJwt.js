require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJwt = (payload, expiresIn, secret = process.env.JWT_SECRET) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn || process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

module.exports = createJwt;
