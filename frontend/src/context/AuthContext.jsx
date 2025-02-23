import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import axiosInstance from '../config/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    // Set token in axios headers on mount
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;
    }
  }, []);

  const { data: user, isLoading: authLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: authService.checkAuth,
    retry: false,
    onError: () => {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async credentials => {
      try {
        const result = await authService.login(credentials);
        return result;
      } catch (error) {
        console.error('Login error in mutation:', error);
        throw error;
      }
    },
    onMutate: () => {
      setLoginError(null);
    },
    onSuccess: data => {
      queryClient.setQueryData(['auth'], { data: { user: data.user } });
      navigate('/');
      toast.success('Successfully logged in!');
    },
    onError: error => {
      const message = error.response?.data?.message || 'Login failed';
      setLoginError(message);
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: data => {
      queryClient.setQueryData(['auth'], { data: { user: data.user } });
      navigate('/');
      toast.success('Successfully registered!');
      setRegisterError(null);
    },
    onError: error => {
      const message = error.response?.data?.message || 'Registration failed';
      setRegisterError(message);
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries first
      queryClient.clear();

      // Reset auth state
      queryClient.setQueryData(['auth'], null);

      // Clear token
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];

      // Navigate and show success message
      navigate('/login');
      toast.success('Successfully logged out');
    },
    onError: () => {
      // Force logout even if API call fails
      queryClient.clear();
      queryClient.setQueryData(['auth'], null);
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      navigate('/login');
    },
  });

  const isLoading =
    authLoading || loginMutation.isPending || logoutMutation.isPending;

  const contextValue = {
    user: user?.data?.user,
    loading: isLoading,
    loginIsLoading: loginMutation.isPending,
    registerIsLoading: registerMutation.isPending,
    login: loginMutation.mutate,
    loginError,
    register: registerMutation.mutate,
    registerError,
    logout: logoutMutation.mutate,
    isAuthenticated: !!user?.data?.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
