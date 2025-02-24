const express = require("express");
const applyMiddleware = require("./middlewares/applyMiddleware");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const brandRouter = require("./routes/brandRoutes");
const authRouter = require("./routes/authRoutes");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const userRouter = require("./routes/userRoutes");
const couponRouter = require("./routes/couponRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const colorRouter = require("./routes/colorRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const subCategoryRouter = require("./routes/subCategoryRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const sizeRouter = require("./routes/sizeRoutes");
const homeBannerRouter = require("./routes/homeBannerRoutes");
const addressRouter = require("./routes/addressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();
applyMiddleware(app);

// =============================================================================
// Routes Section
// =============================================================================
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/sizes", sizeRouter);
app.use("/api/v1/home-banners", homeBannerRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// Error handling middleware
// =============================================================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
