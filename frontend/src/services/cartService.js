import axios from 'axios';
import axiosInstance from '../config/axios';

// Fetch Cart
export const fetchCart = async () => {
  const response = await axiosInstance.get(`/cart`, { withCredentials: true });
  return response.data;
};

// Add to Cart
export const addToCart = async ({ productId, quantity, color, size }) => {
  try {
    const response = await axiosInstance.post(
      `/cart/add`,
      { productId, quantity, color, size },
      {
        withCredentials: true,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Cart error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to add item to cart'
    );
  }
};

// Remove from Cart
export const removeFromCart = async productId => {
  try {
    const response = await axiosInstance.delete(`/cart/remove/${productId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Cart error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to remove item from cart'
    );
  }
};

// Merge Guest Cart on Login
export const mergeCart = async () => {
  const response = await axiosInstance.post(
    `/cart/merge`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// Update Cart Quantity
export const updateCartQuantity = async ({
  productId,
  quantity,
  color,
  size,
}) => {
  try {
    const response = await axiosInstance.patch(
      `/cart/update/${productId}`,
      { quantity, color, size },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Cart error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to update cart quantity'
    );
  }
};
