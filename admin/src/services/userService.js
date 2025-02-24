import api from "../utils/axios";
import toast from "react-hot-toast";

// Get all users with role filter
export const getAllUsers = async (role = "user") => {
  try {
    const response = await api.get("/users", { params: { role } });
    console.log("API Response:", response);

    if (response.users) {
      return response;
    }

    if (response.data?.users) {
      return response.data;
    }

    throw new Error("Unexpected API response format");
  } catch (error) {
    console.error("getAllUsers error:", error);
    const message = error.response?.data?.message || "Failed to fetch users";
    toast.error(message);
    throw error;
  }
};

// Create new admin
export const createAdmin = async (adminData) => {
  try {
    const response = await api.post("/auth/admin/create", adminData);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create admin";
    toast.error(message);
    throw error;
  }
};

// Get single user with validation
export const getUser = async (userId) => {
  try {
    if (!userId || typeof userId !== "string" || userId.length !== 24) {
      throw new Error("Invalid user ID format");
    }
    const response = await api.get(`/users/${userId}`);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Failed to fetch user";
    toast.error(message);
    throw error;
  }
};

// Update user with validation
export const updateUser = async (userId, userData) => {
  try {
    if (!userId || typeof userId !== "string" || userId.length !== 24) {
      throw new Error("Invalid user ID format");
    }
    const response = await api.put(`/users/${userId}`, userData);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Failed to update user";
    toast.error(message);
    throw error;
  }
};

// Get customer analytics
export const getCustomerAnalytics = async () => {
  try {
    const response = await api.get("/users/analytics");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch analytics";
    toast.error(message);
    throw error;
  }
};

// Get customer growth data
export const getCustomerGrowth = async () => {
  try {
    const response = await api.get("/users/growth");
    return { data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch growth data";
    toast.error(message);
    throw error;
  }
};

// Get online users
export const getOnlineUsers = async () => {
  try {
    const response = await api.get("/users/online");
    return { data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch online users";
    toast.error(message);
    throw error;
  }
};
