import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../utils/axios";

const AuthContext = createContext(null);

const authApi = {
  checkAuth: () => api.get("/auth/check"),
  login: (credentials) => api.post("/auth/admin/login", credentials),
  logout: () => api.post("/auth/logout"),
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: authApi.checkAuth,
    retry: false,
    select: (data) => data.user,
    onError: () => {
      localStorage.removeItem("token");
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["auth"], data);
      navigate("/app/dashboard");
      toast.success("Login successful!");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      localStorage.removeItem("token");
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

export const useAuth = () => useContext(AuthContext);
