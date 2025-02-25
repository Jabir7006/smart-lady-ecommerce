import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist,
} from '../services/wishlistService';
import { toast } from 'react-hot-toast';

export const useWishlist = () => {
  const queryClient = useQueryClient();

  // Fetch wishlist
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  // Add to Wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onMutate: async productId => {
      await queryClient.cancelQueries(['wishlist']);
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      // Optimistically update wishlist
      queryClient.setQueryData(['wishlist'], old => ({
        ...old,
        products: [...(old?.products || []), { _id: productId }],
      }));

      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['wishlist'], context.previousWishlist);
      toast.error('Failed to add item to wishlist');
    },
    onSuccess: data => {
      queryClient.setQueryData(['wishlist'], data.wishlist);
      toast.success('Item added to wishlist');
    },
  });

  // Remove from Wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: removeFromWishlist,
    onMutate: async productId => {
      await queryClient.cancelQueries(['wishlist']);
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      // Optimistically update wishlist
      queryClient.setQueryData(['wishlist'], old => ({
        ...old,
        products: old.products.filter(product => product._id !== productId),
      }));

      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['wishlist'], context.previousWishlist);
      toast.error('Failed to remove item from wishlist');
    },
    onSuccess: data => {
      // Update with server data
      queryClient.setQueryData(['wishlist'], data.wishlist);
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries(['wishlist']);
    },
  });

  // Merge Wishlist
  const mergeWishlistMutation = useMutation({
    mutationFn: mergeWishlist,
    onSuccess: data => {
      queryClient.setQueryData(['wishlist'], data.wishlist);
      toast.success('Wishlist merged successfully');
    },
    onError: () => {
      toast.error('Failed to merge wishlist');
    },
  });

  return {
    wishlist,
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    mergeWishlist: mergeWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isLoading,
    isRemovingFromWishlist: removeFromWishlistMutation.isLoading,
  };
};
