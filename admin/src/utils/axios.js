import axios from "axios";
import { base_url } from "./baseUrl";
import toast from "react-hot-toast";

// Create axios instance with default config
const api = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.get(`${base_url}/auth/refresh`, {
          withCredentials: true,
        });

        const { accessToken } = response.data;

        if (accessToken) {
          // Update token in localStorage and headers
          localStorage.setItem("token", accessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          // Retry the original request with the new token
          const retryResponse = await axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return retryResponse.data;
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;
