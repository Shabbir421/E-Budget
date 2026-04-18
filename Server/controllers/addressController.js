/** @format */

//get user address
//get /api/address
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ user: userId });

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Get Addresses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// add new address
//post /api/address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, city, state, country, pincode } = req.body;

    if (!address || !city || !state || !country || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newAddress = await Address.create({
      user: userId,
      address,
      city,
      state,
      country,
      pincode,
    });

    return res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//update address
//put /api/address/:id
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const { address: addr, city, state, country, pincode } = req.body;

    address.address = addr || address.address;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.pincode = pincode || address.pincode;

    await address.save();

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("Update Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//delete address
//delete /api/address/:id
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
