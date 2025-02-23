const Cart = require("../models/Cart");

// Helper function to get cart by user or session
const getCartByUserOrSession = async (userId, sessionId) => {
  if (userId) {
    return await Cart.findOne({ user: userId }).populate("items.product");
  }
  return await Cart.findOne({ sessionId }).populate("items.product");
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, color, size } = req.body;
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    let cart = await getCartByUserOrSession(userId, sessionId);

    if (!cart) {
      cart = new Cart({ user: userId, sessionId, items: [] });
    }

    // Check if item exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product._id?.toString() === productId ||
        item.product?.toString() === productId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].color = color;
      cart.items[existingItemIndex].size = size;
    } else {
      cart.items.push({ product: productId, quantity, color, size });
    }

    await cart.save();

    // Fetch the updated cart
    const updatedCart = await getCartByUserOrSession(userId, sessionId);

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    const cart = await getCartByUserOrSession(userId, sessionId);
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    let cart = await getCartByUserOrSession(userId, sessionId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialItemCount = cart.items.length;

    // Filter items properly
    cart.items = cart.items.filter((item) => {
      return item.product._id.toString() !== productId; // Ensure proper comparison
    });

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    const updatedCart = await cart.populate("items.product");
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

// Merge guest cart on login
exports.mergeCartOnLogin = async (req, res) => {
  const userId = req.user.id;
  const sessionId = req.sessionID;

  try {
    const guestCart = await Cart.findOne({ sessionId });
    const userCart = await Cart.findOne({ user: userId });

    if (guestCart) {
      if (userCart) {
        guestCart.items.forEach((guestItem) => {
          const existingItem = userCart.items.find(
            (item) => item.product.toString() === guestItem.product.toString()
          );
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            userCart.items.push(guestItem);
          }
        });
        await userCart.save();
        await guestCart.deleteOne();
      } else {
        guestCart.user = userId;
        guestCart.sessionId = null;
        await guestCart.save();
      }
    }

    res.json({ success: true, message: "Cart merged successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Cart Quantity
exports.updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity, color, size } = req.body;
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    let cart = await getCartByUserOrSession(userId, sessionId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.product._id.toString() === productId &&
        item.color === color &&
        item.size === size
    );
    console.log(cartItem);

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cartItem.quantity = quantity;
    await cart.save();
    const updatedCart = await cart.populate("items.product");
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
};
