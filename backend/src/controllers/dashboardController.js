const Order = require("../models/Order");
const User = require("../models/User");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCustomers, totalRevenue, newOrders, totalOrders] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
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
        Order.countDocuments({
          createdAt: { $gte: today },
        }),
        Order.countDocuments(),
      ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalRevenue: totalRevenue[0]?.total || 0,
        newOrders,
        totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get sales analytics
const getSalesAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const today = new Date();
    let startDate;
    let dateFormat;
    let groupBy;

    switch (period) {
      case "week":
        startDate = new Date(today.setDate(today.getDate() - 7));
        dateFormat = "%Y-%m-%d";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
        break;
      case "month":
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        dateFormat = "%Y-%m-%d";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
        break;
      case "year":
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        dateFormat = "%Y-%m";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
        break;
      default:
        startDate = new Date(today.setDate(today.getDate() - 7));
        dateFormat = "%Y-%m-%d";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
    }

    const [salesData, ordersData] = await Promise.all([
      // Sales data
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: groupBy,
            total: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Orders count
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: groupBy,
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const labels = salesData.map((item) => item._id);
    const sales = salesData.map((item) => item.total);
    const orders = ordersData.map((item) => item.count);

    res.json({
      success: true,
      data: { labels, sales, orders },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get revenue distribution
const getRevenueDistribution = async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const codRevenue =
      revenueData.find((item) => item._id === "COD")?.total || 0;
    const onlineRevenue =
      revenueData.find((item) => item._id === "ONLINE")?.total || 0;
    const walletRevenue =
      revenueData.find((item) => item._id === "WALLET")?.total || 0;

    res.json({
      success: true,
      data: {
        codRevenue,
        onlineRevenue,
        walletRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get customer analytics
const getCustomerAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1));

    const [newCustomers, activeCustomers, totalOrders, averageOrderValue] =
      await Promise.all([
        User.countDocuments({
          role: "user",
          createdAt: { $gte: lastMonth },
        }),
        Order.distinct("user").length,
        Order.countDocuments({ status: { $ne: "Cancelled" } }),
        Order.aggregate([
          {
            $match: {
              status: { $ne: "Cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: "$totalPrice" },
            },
          },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        newCustomers,
        activeCustomers,
        totalOrders,
        averageOrderValue: averageOrderValue[0]?.avg || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product analytics
const getProductAnalytics = async (req, res) => {
  try {
    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          name: "$product.title",
          totalSold: 1,
          totalRevenue: 1,
          price: "$product.price",
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getSalesAnalytics,
  getRevenueDistribution,
  getCustomerAnalytics,
  getProductAnalytics,
};
