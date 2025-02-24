const asyncHandler = require("express-async-handler");
const { findAllUsers, findUserById } = require("../services/users");

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const search = req.query.search || "";

  const { users, total } = await findAllUsers({ limit, page, search });

  res.status(200).json({
    users,
    pagination: {
      current: page,
      limit,
      items: total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // If the ID is 'me', use the authenticated user's ID
  const userId = id === "me" ? req.user._id : id;

  const user = await findUserById(userId);
  res.status(200).json(user);
});

module.exports = {
  getAllUsers,
  getSingleUser,
};
