import Address from "../models/Address.js";

// POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    await Address.create({ ...address, userId });

    res.json({ success: true, msg: "Address added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};

// GET /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;

    const addresses = await Address.find({ userId }); 

    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
