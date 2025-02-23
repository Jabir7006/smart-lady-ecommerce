import axiosInstance from '../config/axios'

const API_BASE_URL = '/wishlist'
// Fetch Wishlist
export const fetchWishlist = async () => {
  const response = await axiosInstance.get(`${API_BASE_URL}`, {
    withCredentials: true,
  })
  return response.data
}

// Add to Wishlist
export const addToWishlist = async productId => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/add`,
    { productId },
    { withCredentials: true }
  )
  return response.data
}

// Remove from Wishlist
export const removeFromWishlist = async productId => {
  const response = await axiosInstance.delete(`/wishlist/remove/${productId}`, {
    withCredentials: true,
  })
  return response.data
}

// Merge Guest Wishlist on Login
export const mergeWishlist = async () => {
  const response = await axiosInstance.post(
    `/wishlist/merge`,
    {},
    { withCredentials: true }
  )
  return response.data
}
