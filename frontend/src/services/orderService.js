import axiosInstance from '../config/axios';

// Create a new order
export const createOrder = async data => {
  const response = await axiosInstance.post('/orders', data);
  return response.data;
};

// Get user's orders
export const getOrders = async () => {
  const response = await axiosInstance.get('/orders/my-orders');
  return response.data.orders || [];
};

// Get single order
export const getOrderById = async orderId => {
  const response = await axiosInstance.get(`/orders/my-orders/${orderId}`);
  return response.data.order;
};

// Cancel order
export const cancelOrder = async orderId => {
  const response = await axiosInstance.put(
    `/orders/my-orders/${orderId}/cancel`
  );
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};
