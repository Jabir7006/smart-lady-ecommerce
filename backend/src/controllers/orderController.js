const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const {
  createOrderForUser,
  getOrdersForUser,
  updateUserOrderStatus,
} = require('../services/orderService');
const validateMongodbId = require('../utils/validateMongodbId');

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  const order = await createOrderForUser(_id, COD, couponApplied);
  res.status(200).json({
    message: 'Order created successfully',
    order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const orders = await getOrdersForUser(_id);
  res.status(200).json({
    orders,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const { status } = req.body;
  if (!status) throw createError(400, 'Status is required');
  const order = await updateUserOrderStatus(id, status);
  res.status(200).json({
    message: 'Order status updated successfully',
    order,
  });
});

module.exports = { createOrder, getOrders, updateOrderStatus };
