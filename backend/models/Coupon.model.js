import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, "Coupon code is required"], unique: true },
    discount: { type: Number, required: [true, "Discount percentage is required"], min: [0, "Discount must be a positive number"], max: [100, "Discount cannot exceed 100%"] },
    // expirationDate: { type: Date, required: [true, "Expiration date is required"] },
    isActive: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
  },
  { timestamps: true },
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
