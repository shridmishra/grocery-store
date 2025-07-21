import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    await Address.create(...address, userId);
    res.json({ success: true, msg: "address added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};

// get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const addresses = await Address.findOne({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
