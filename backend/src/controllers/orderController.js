const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create new order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // Get user's cart with populated product details
    const cart = await Cart.findOne({
      $or: [
        { user: req.user._id },
        { _id: req.cookies.cartId || req.body.cartId },
      ],
    }).populate({
      path: "items.product",
      select: "title images discountPrice regularPrice",
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate prices
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      price: item.product.discountPrice || item.product.regularPrice,
    }));

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingPrice = 100; // Flat rate shipping
    const totalPrice = subtotal + shippingPrice;

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      shippingPrice,
      totalPrice,
    });

    await order.save();

    // Clear cart after order creation
    await Cart.findByIdAndUpdate(cart._id, { $set: { items: [] } });

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "orderItems.product",
        select: "title images",
      })
      .populate("shippingAddress")
      .populate("user", "fullName email");

    res.status(201).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

// Get all orders for admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "orderItems.product",
        select: "title images",
      })
      .populate("shippingAddress")
      .populate("user", "fullName email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "orderItems.product",
        select: "title images",
      })
      .populate("shippingAddress")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "orderItems.product",
        select: "title images",
      })
      .populate("shippingAddress")
      .populate("user", "fullName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if the order belongs to the logged-in user or if the user is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentStatus = "Paid";
    } else if (status === "Cancelled") {
      order.cancelledAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel order (user)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Only allow cancellation if order is pending
    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "Cancelled";
    order.cancelledAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order statistics for admin
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      completedOrders,
      cancelledOrders,
      todayOrders,
      todayRevenue,
      monthlyRevenue,
      totalRevenue,
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments(),

      // Orders by status
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Order.countDocuments({ status: "Cancelled" }),

      // Today's orders
      Order.countDocuments({
        createdAt: { $gte: today },
      }),

      // Today's revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]),

      // Monthly revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfMonth },
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]),

      // Total revenue (all time)
      Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        completedOrders,
        cancelledOrders,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error getting order stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get order statistics",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};
