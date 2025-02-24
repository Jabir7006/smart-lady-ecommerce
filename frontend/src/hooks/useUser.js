import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../services/userService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();

  // Get user profile query
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    // Only fetch if we have an authenticated user
    enabled: !!authUser,
    // Return auth user data as fallback
    placeholderData: authUser,
    // Handle null response
    select: data => data || authUser,
    // Retry only once for 401 errors
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  // Update profile mutation
  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: data => {
      queryClient.setQueryData(['profile'], data);
      toast.success('Profile updated successfully');
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Change password mutation
  const { mutate: updatePassword, isLoading: isChangingPassword } = useMutation(
    {
      mutationFn: changePassword,
      onSuccess: () => {
        toast.success('Password changed successfully');
      },
      onError: error => {
        toast.error(
          error.response?.data?.message || 'Failed to change password'
        );
      },
    }
  );

  return {
    profile: profile || authUser, // Ensure we always return a value
    isLoading,
    error,
    updateProfile,
    isUpdating,
    updatePassword,
    isChangingPassword,
  };
};
