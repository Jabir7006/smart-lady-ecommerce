const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
      },
    ],

    paymentIntent: {},
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderStatus: {
      type: String,
      // enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'Cash on Delivery',
        'Processing',
        'Dispatched',
        'Cancelled',
        'Delivered',
      ],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
