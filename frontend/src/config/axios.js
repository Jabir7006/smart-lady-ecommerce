import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check specifically for token expiration
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === 'TokenExpired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log('Token expired, attempting refresh...');
        const response = await axiosInstance.get('/auth/refresh', {
          withCredentials: true,
        });

        const { accessToken } = response.data;

        if (accessToken) {
          console.log('Got new access token');
          localStorage.setItem('token', accessToken);
          axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // If refresh fails, clear everything and redirect to login
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
