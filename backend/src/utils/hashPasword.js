const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
  try {
    // Ensure password is a string
    if (typeof password !== "string") {
      password = String(password);
    }

    const saltRound = 10;
    const salt = await bcryptjs.genSalt(saltRound);
    const hash = await bcryptjs.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcryptjs.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashPassword, comparePassword };
