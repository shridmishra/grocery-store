// Place Order COD: /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      res.json({ success: false, msg: "Invalid Data" });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({ success: true, msg: "Orders Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get Orders by userid : /api/order/user

export const getUserOrder = async (req, res) => {
  try {
    let userId;
    
    // In production, use authenticated user
    if (req.user && req.user.id) {
      userId = req.user.id.toString();
    } 
    // Fallback for development/testing
    else if (process.env.NODE_ENV === 'development' && req.query.userId) {
      userId = req.query.userId;
    }
    else {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }
    
    
    const orders = await Order.find({
      userId: userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({
        createdAt: -1,
      });
    
    
    res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (for sellers/admin): /api/order/seller

export const getAllOrder = async (req, res) => {
  try {
    
    const orders = await Order.find({
      
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({
        createdAt: -1,
      });
    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
