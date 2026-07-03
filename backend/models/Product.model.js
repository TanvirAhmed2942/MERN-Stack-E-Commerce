import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isFeatured: { type: Boolean, default: false },
    images: [
        {
            url: String,
            public_id: String
        }
    ]
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
