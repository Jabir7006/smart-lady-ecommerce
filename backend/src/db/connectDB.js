const mongoose = require("mongoose");

const connectionURL = `${process.env.DB_CONNECTION_URL}${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionURL);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
