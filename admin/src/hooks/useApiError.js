import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useApiError = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (event?.type === 'error') {
        const error = event.error;
        if (error?.response?.status === 401) {
          queryClient.clear();
          navigate('/login');
          toast.error('Session expired. Please login again.');
        } else if (error?.response?.status === 403) {
          toast.error('You do not have permission to perform this action');
        } else if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, navigate]);
}; 