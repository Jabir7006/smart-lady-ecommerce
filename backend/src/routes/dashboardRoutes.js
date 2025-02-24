const express = require("express");
const dashboardRouter = express.Router();
const {
  getDashboardStats,
  getSalesAnalytics,
  getRevenueDistribution,
  getCustomerAnalytics,
  getProductAnalytics,
} = require("../controllers/dashboardController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Protect all dashboard routes
dashboardRouter.use(authMiddleware);
dashboardRouter.use(isAdmin);

// Dashboard routes
dashboardRouter.get("/stats", getDashboardStats);
dashboardRouter.get("/sales-analytics", getSalesAnalytics);
dashboardRouter.get("/revenue-distribution", getRevenueDistribution);
dashboardRouter.get("/customer-analytics", getCustomerAnalytics);
dashboardRouter.get("/product-analytics", getProductAnalytics);

module.exports = dashboardRouter;
