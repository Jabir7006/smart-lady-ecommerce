import axios from 'axios';
import axiosInstance from '../config/axios';

// Get all addresses
export const fetchAddresses = async () => {
  const { data } = await axiosInstance.get('/addresses');
  return data.addresses;
};

// Create a new address
export const createAddress = async newAddress => {
  const { data } = await axiosInstance.post('/addresses', newAddress);
  return data;
};

// Update an address
export const updateAddress = async ({ id, updatedAddress }) => {
  const { data } = await axiosInstance.put(`/addresses/${id}`, updatedAddress);
  return data;
};

// Delete an address
export const deleteAddress = async id => {
  const { data } = await axiosInstance.delete(`/addresses/${id}`);
  return data;
};
