const Wishlist = require("../models/Wishlist");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    let wishlist =
      (await Wishlist.findOne({ user: userId })) ||
      (await Wishlist.findOne({ sessionId }));

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, sessionId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    const populatedWishlist = await wishlist.populate("products");
    res.json({ success: true, wishlist: populatedWishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    const wishlist =
      (await Wishlist.findOne({ user: userId })) ||
      (await Wishlist.findOne({ sessionId }));

    const wishlistWithProducts = await wishlist.populate({
      path: "products",
      populate: [
        {
          path: "colors",
          select: "title", // Only get the title field
        },
        {
          path: "sizes",
          select: "title", // Only get the title field
        },
      ],
    });

    res.json(wishlistWithProducts || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;

  try {
    // Use findOneAndUpdate instead of findOne to avoid concurrent modification issues
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { 
        $or: [
          { user: userId },
          { sessionId: sessionId }
        ]
      },
      {
        $pull: { products: productId }
      },
      { 
        new: true, // Return the updated document
        runValidators: true
      }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Populate the wishlist before sending the response
    const populatedWishlist = await updatedWishlist.populate({
      path: "products",
      populate: [
        {
          path: "colors",
          select: "title",
        },
        {
          path: "sizes",
          select: "title",
        },
      ],
    });

    res.json({ success: true, wishlist: populatedWishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to remove product from wishlist",
      error: error.message 
    });
  }
};

// Merge guest wishlist on login
exports.mergeWishlistOnLogin = async (req, res) => {
  const userId = req.user.id;
  const sessionId = req.sessionID;

  try {
    const guestWishlist = await Wishlist.findOne({ sessionId });
    const userWishlist = await Wishlist.findOne({ user: userId });

    if (guestWishlist) {
      if (userWishlist) {
        userWishlist.products = [
          ...new Set([...userWishlist.products, ...guestWishlist.products]),
        ];
        await userWishlist.save();
        await guestWishlist.deleteOne();
      } else {
        guestWishlist.user = userId;
        guestWishlist.sessionId = null;
        await guestWishlist.save();
      }
    }

    res.json({ success: true, message: "Wishlist merged successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
