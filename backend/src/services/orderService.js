const uuid = require("uuid").v4;
const createError = require("http-errors");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const validateMongodbId = require("../utils/validateMongodbId");

const createOrderForUser = async (id, COD, couponApplied) => {
  validateMongodbId(id);

  if (!COD) throw new Error("Create cash order failed");
  const user = await User.findById(id);
  let userCart = await Cart.findOne({ orderby: user._id }).populate(
    "products.product"
  );
  if (!userCart || userCart.products.length === 0)
    throw new Error("Your cart is empty");

  let finalAmount = 0;
  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount;
  } else {
    finalAmount = userCart.cartTotal;
  }

  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uuid(),
      method: "COD",
      amount: finalAmount,
      status: "Cash on Delivery",
      created: new Date(),
      currency: "bdt",
    },
    orderby: user._id,
    orderStatus: "Cash on Delivery",
  }).save();

  // Update product quantities
  let update = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  await Product.bulkWrite(update, {});

  // Clear the cart after successful order
  await Cart.findByIdAndDelete(userCart._id);

  return newOrder;
};

const getOrdersForUser = async (id) => {
  const orders = await Order.findOne({ orderby: id });
  if (!orders) throw createError(404, "No orders found");
  return orders;
};

const updateUserOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    },
    { new: true }
  );
  if (!order) throw createError(404, "Order not found");
  return order;
};

module.exports = {
  createOrderForUser,
  getOrdersForUser,
  updateUserOrderStatus,
};
