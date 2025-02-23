const createError = require("http-errors");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Coupon = require("../models/Coupon");

const addToCart = async (id, cart) => {
  let products = [];
  const user = await User.findById(id);
  // check if user already have product in cart
  const alreadyExistCart = await Cart.findOne({ orderby: user._id });
  if (alreadyExistCart) {
    alreadyExistCart.remove();
  }
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    let getPrice = await Product.findById(cart[i]._id).select("price").exec();
    object.price = getPrice.price;
    products.push(object);
  }
  const cartTotal = products.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
  const totalAfterDiscount = cartTotal;
  const newCart = await new Cart({
    products,
    cartTotal,
    totalAfterDiscount,
    orderby: user._id,
  }).save();
  return newCart;
};

const getCart = async (id) => {
  const cart = await Cart.findOne({ orderby: id }).populate("products.product");
  if (!cart) {
    throw createError(404, "No Item in Cart");
  }
  return cart;
};

const deleteCart = async (id) => {
  const cart = await Cart.findOneAndDelete({ orderby: id });
  if (!cart) {
    throw createError(404, "Cart not found");
  }
};

const applyCouponToCart = async (coupon, id) => {
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) {
    throw createError(404, "Invalid Coupon");
  }
  const user = await User.findById(id);

  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  return totalAfterDiscount;
};

module.exports = {
  addToCart,
  getCart,
  deleteCart,
  applyCouponToCart,
};
