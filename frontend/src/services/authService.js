import axiosInstance from '../config/axios';

export const authService = {
  login: async credentials => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials, {
        withCredentials: true,
      });

      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${response.data.accessToken}`;
      }

      return {
        user: response.data.user,
        token: response.data.accessToken,
      };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async userData => {
    const response = await axiosInstance.post('/auth/register', userData, {
      withCredentials: true,
    });

    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.accessToken}`;
    }

    return {
      user: response.data.user,
      token: response.data.accessToken,
    };
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/refresh', {
        withCredentials: true, // Important for cookies
      });

      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${response.data.accessToken}`;
      }
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return axiosInstance.get('/auth/check-user');
  },
};
