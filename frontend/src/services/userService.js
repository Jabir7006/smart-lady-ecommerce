import axiosInstance from '../config/axios';

// Get user profile
export const getUserProfile = async () => {
  try {
    const { data } = await axiosInstance.get('/auth/check-user');
    return data.user || null; // Return null if no user data
  } catch (error) {
    // If error is 401 (Unauthorized), return null
    if (error.response?.status === 401) {
      return null;
    }
    throw error; // Re-throw other errors
  }
};

// Update user profile
export const updateUserProfile = async userData => {
  const { data } = await axiosInstance.put('/users/me', userData);
  return data.user;
};

// Change password
export const changePassword = async passwords => {
  const { data } = await axiosInstance.put('/users/me/password', passwords);
  return data;
};
