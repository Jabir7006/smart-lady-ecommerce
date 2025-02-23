const express = require('express');
const orderRouter = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/', authMiddleware, getOrders);
orderRouter.put(
  '/:id',
  authMiddleware,

  updateOrderStatus
);

module.exports = orderRouter;
