import api from "../utils/axios";

// Get all orders
export const getAllOrders = async () => {
  return await api.get("/orders/admin/orders");
};

// Get order statistics
export const getOrderStats = async () => {
  return await api.get("/orders/admin/stats");
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  return await api.put(`/orders/admin/orders/${orderId}/status`, { status });
};

// Get single order details
export const getOrderDetails = async (orderId) => {
  return await api.get(`/orders/admin/orders/${orderId}`);
};
