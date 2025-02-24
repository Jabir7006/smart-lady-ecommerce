import api from "../utils/axios";

// Get all users
export const getAllUsers = async () => {
  return await api.get("/users");
};

// Create new admin
export const createAdmin = async (adminData) => {
  return await api.post("/auth/admin/create", adminData);
};

// Get single user
export const getUser = async (userId) => {
  return await api.get(`/users/${userId}`);
};

// Update user
export const updateUser = async (userId, userData) => {
  return await api.put(`/users/${userId}`, userData);
};
