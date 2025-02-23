import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  fetchCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from '../services/cartService';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 1000,
    cacheTime: 5000,
  });

  // Add to Cart
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onMutate: async ({ productId, quantity, color, size }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update cart
      queryClient.setQueryData(['cart'], old => {
        if (!old?.items) return { items: [] };

        const existingItemIndex = old.items.findIndex(
          item => item.product._id === productId
        );

        if (existingItemIndex > -1) {
          // Update existing item quantity and attributes
          const updatedItems = [...old.items];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedItems[existingItemIndex].color = color;
          updatedItems[existingItemIndex].size = size;
          return { ...old, items: updatedItems };
        } else {
          // Add new item with color and size
          return {
            ...old,
            items: [
              ...old.items,
              { product: { _id: productId }, quantity, color, size },
            ],
          };
        }
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(err.message || 'Failed to add item to cart');
    },
    onSuccess: data => {
      // Update with server data
      queryClient.setQueryData(['cart'], data.cart);
      toast.success('Item added to cart');
    },
  });

  // Remove from Cart
  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCart,
    onMutate: async productId => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], old => ({
        ...old,
        items: old.items.filter(item => item.product._id !== productId),
      }));

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(err.message || 'Failed to remove item from cart');
    },
    onSuccess: data => {
      // Update with server data
      queryClient.setQueryData(['cart'], data.cart);
      toast.success('Item removed from cart');
    },
  });

  // Update quantity
  const updateQuantityMutation = useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ productId, quantity, color, size }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update cart
      queryClient.setQueryData(['cart'], old => ({
        ...old,
        items: old.items.map(item =>
          item.product._id === productId &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity }
            : item
        ),
      }));

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(err.message || 'Failed to update quantity');
    },
    onSuccess: data => {
      // Update with server data
      queryClient.setQueryData(['cart'], data.cart);
      toast.success('Cart updated');
    },
  });

  return {
    cart,
    isLoading,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    isAddingToCart: addToCartMutation.isLoading,
    isRemovingFromCart: removeFromCartMutation.isLoading,
    isUpdatingQuantity: updateQuantityMutation.isLoading,
  };
};
