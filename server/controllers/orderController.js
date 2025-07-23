// Place Order Stripe: /api/order/stripe

import stripe from "stripe";
import User from "../models/User.js"

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;
    if (!address || items.length === 0) {
      res.json({ success: false, msg: "Invalid Data" });
    }

    let productData = [];

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Stripe GateWay Initialize

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create line items from stripe;
    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
      },
      quantity: item.quantity,
    }));

    //Create Session

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-order`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({
      success: true,
      url: session.url,
      msg: "Orders Placed Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Stripe Webhooks to  Verify Payments Action : /stripe

export const stripeWebhooks = async (req, res) => {
  // Stripe GateWay Initialize

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers["stripe-signature"];

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
  }

  //handle event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // GET session metadata

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;

      // Mark payment as paid

      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // GET session metadata

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }
  res.json({
    received:true
  })
};

// Place Order COD: /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";

import { response } from "express";

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
    else if (process.env.NODE_ENV === "development" && req.query.userId) {
      userId = req.query.userId;
    } else {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
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
