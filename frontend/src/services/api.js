import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:4000/api/v1',
});

// Add request deduplication
const pendingRequests = new Map();

api.interceptors.request.use(config => {
  const requestKey = `${config.method}:${config.url}`;

  if (pendingRequests.has(requestKey)) {
    return Promise.reject('Duplicate request cancelled');
  }

  pendingRequests.set(requestKey, true);
  return config;
});

api.interceptors.response.use(
  response => {
    const requestKey = `${response.config.method}:${response.config.url}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  error => {
    const requestKey = `${error.config.method}:${error.config.url}`;
    pendingRequests.delete(requestKey);
    return Promise.reject(error);
  }
);

// Add the checkUser function
export const checkUser = async () => {
  const response = await api.get('/auth/check-user');
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export default api;
