import api from "../utils/axios";

// Get dashboard statistics
export const getDashboardStats = async () => {
  return await api.get("/dashboard/stats");
};

// Get sales analytics data
export const getSalesAnalytics = async (period = "week") => {
  return await api.get(`/dashboard/sales-analytics?period=${period}`);
};

// Get revenue distribution
export const getRevenueDistribution = async () => {
  return await api.get("/dashboard/revenue-distribution");
};

// Get customer analytics
export const getCustomerAnalytics = async () => {
  return await api.get("/dashboard/customer-analytics");
};

// Get product analytics
export const getProductAnalytics = async () => {
  return await api.get("/dashboard/product-analytics");
};
