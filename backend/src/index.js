require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./db/");

// Remove http server creation since Vercel handles this
const PORT = process.env.PORT || 4000;

// Connect to database
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database Error:", err);
  });

// Export the Express app directly
module.exports = app;
