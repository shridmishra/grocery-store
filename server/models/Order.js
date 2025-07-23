import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" }, // Changed to ObjectId
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" }, // Changed to ObjectId
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "address" }, // Changed to ObjectId
  status: { type: String, default: "Order Placed" },
  paymentType: { type: String, required: true},
  isPaid: { type: Boolean, default: false },
},{timestamps:true});

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;