import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orders: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
      },
    ],
    totalPrice: { type: Number, required: true, min: [0, "Total price must be a positive number"] },
    stripePaymentIntentId: { type: String, required: true,unique: true },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
