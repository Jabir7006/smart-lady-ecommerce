const express = require("express");
const orderRouter = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require("../controllers/orderController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Protect all order routes
orderRouter.use(authMiddleware);

// User routes
orderRouter.post("/", createOrder);
orderRouter.get("/my-orders", getUserOrders);
orderRouter.get("/my-orders/:id", getOrderById);
orderRouter.put("/my-orders/:id/cancel", cancelOrder);

// Admin routes
orderRouter.get("/admin/orders", isAdmin, getAllOrders);
orderRouter.get("/admin/orders/:id", isAdmin, getOrderById);
orderRouter.get("/admin/stats", isAdmin, getOrderStats);
orderRouter.put("/admin/orders/:id/status", isAdmin, updateOrderStatus);

module.exports = orderRouter;
