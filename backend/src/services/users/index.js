const createError = require("http-errors");
const User = require("../../models/User");
const validateMongodbId = require("../../utils/validateMongodbId");

const createUser = async ({ fullName, email, password }) => {
  const newUser = new User({ fullName, email, password });
  const savedUser = await newUser.save();
  return savedUser;
};

const findAllUsers = async ({ limit, page, search }) => {
  const skip = (page - 1) * limit;

  // Create search query
  const searchQuery = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(searchQuery).skip(skip).limit(limit).select("-password").lean(),
    User.countDocuments(searchQuery),
  ]);

  return { users, total };
};
const findUserById = async (id) => {
  validateMongodbId(id);
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw createError(404, "User not found");
  }
  return user;
};

const findWishlistById = async (id) => {
  const wishlist = await User.findById(id)
    .populate("wishlist")
    .select("wishlist")
    .lean();
  if (!wishlist) {
    throw createError(404, "Wishlist not found");
  }
  return wishlist;
};

module.exports = {
  createUser,
  findAllUsers,
  findUserById,
  findWishlistById,
};
