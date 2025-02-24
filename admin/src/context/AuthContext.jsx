import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../utils/axios";

const AuthContext = createContext(null);

const authApi = {
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/check");
      return response;
    } catch (error) {
      // If token is expired or invalid, try to refresh
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await api.get("/auth/refresh");
          if (refreshResponse.accessToken) {
            localStorage.setItem("token", refreshResponse.accessToken);
            // Retry the auth check with new token
            return await api.get("/auth/check");
          }
        } catch (refreshError) {
          throw error; // If refresh fails, throw original error
        }
      }
      throw error;
    }
  },
  login: (credentials) => api.post("/auth/admin/login", credentials),
  logout: () => api.post("/auth/logout"),
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set token in axios headers on mount
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: authApi.checkAuth,
    retry: false,
    select: (data) => data.user,
    onError: () => {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      queryClient.setQueryData(["auth"], { user: data.user });
      navigate("/app/dashboard");
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      queryClient.clear();
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      queryClient.clear();
      navigate("/login");
      toast.error(error.response?.data?.message || "Error during logout");
    },
  });

  const login = (credentials) => {
    loginMutation.mutate(credentials);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
