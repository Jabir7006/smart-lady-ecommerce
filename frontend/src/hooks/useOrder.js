import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from '../services/orderService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create order mutation
  const { mutate: createOrderMutation, isLoading: isCreatingOrder } =
    useMutation({
      mutationFn: createOrder,
      onSuccess: data => {
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['cart']);
        toast.success('Order placed successfully!');
        navigate(`/profile/orders/${data.order._id}`);
      },
      onError: error => {
        toast.error(error.response?.data?.message || 'Failed to place order');
      },
    });

  // Get user orders query
  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  // Cancel order mutation
  const { mutate: cancelOrderMutation, isLoading: isCancellingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Order cancelled successfully');
      },
      onError: error => {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      },
    });

  return {
    // Mutations
    createOrder: createOrderMutation,
    isCreatingOrder,
    cancelOrder: cancelOrderMutation,
    isCancellingOrder,

    // Queries
    orders,
    isLoadingOrders,
    ordersError,
  };
};

// Hook for single order
export const useOrderDetails = orderId => {
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  const { mutate: cancelOrderMutation, isLoading: isCancelling } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId]);
      queryClient.invalidateQueries(['orders']);
      toast.success('Order cancelled successfully');
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });

  return {
    order,
    isLoading,
    error: error?.response?.data || error,
    cancelOrder: cancelOrderMutation,
    isCancelling,
  };
};
