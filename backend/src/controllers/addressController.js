const Address = require("../models/Address");
// Create a new address
const createAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      street,
      area,
      city,
      division,
      postCode,
      addressType,
      isDefault,
    } = req.body;

    const newAddress = new Address({
      user: req.user._id, // Assuming user ID is available from authentication middleware
      fullName,
      phone,
      street,
      area,
      city,
      division,
      postCode,
      addressType,
      isDefault,
    });

    if (isDefault) {
      // Set all other addresses as non-default
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    await newAddress.save();
    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single address
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address || address.user.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address || address.user.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    const {
      fullName,
      phone,
      street,
      area,
      city,
      division,
      postCode,
      addressType,
      isDefault,
    } = req.body;

    // Update address fields
    address.fullName = fullName;
    address.phone = phone;
    address.street = street;
    address.area = area;
    address.city = city;
    address.division = division;
    address.postCode = postCode;
    address.addressType = addressType;
    address.isDefault = isDefault;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }

    await address.save();
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address || address.user.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    await Address.deleteOne({ _id: address._id });
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
