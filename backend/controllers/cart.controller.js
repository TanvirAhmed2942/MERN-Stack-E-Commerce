
import { redis_client as Redis } from "../lib/redis.js";
import e from "express";
import User from "../models/user.model.js";


export const getAllCartItems = async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).populate("cartitems.productId", "name price images.url");
    res.status(200).json({ message: "Get all cart items", cartitems: user.cartitems });
}

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    const existingProduct = user.cartitems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      await User.updateOne(
        {
          _id: user._id,
          "cartitems.productId": productId,
        },
        {
          $inc: {
            "cartitems.$.quantity": quantity,
          },
        }
      );

      return res.status(200).json({
        message: "Cart quantity updated successfully",
      });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          cartitems: {
            productId,
            quantity,
          },
        },
      }
    );

    return res.status(200).json({
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateQuantity = async (req, res) => {
    
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;
    // console.log("Updating quantity for cart item ID:", id, "with quantity:", quantity, "for user ID:", userId);

    if (!quantity || quantity <= 0) {
        return res.status(400).json({
            message: "Quantity is required and must be greater than 0",
        });
    }
    const user = await User.findById(userId);
    const existingProduct = user.cartitems.find(
        (item) => item._id.toString() === id
    );

    if (!existingProduct) {
        return res.status(404).json({
            message: "Item not found in cart",
        });
    }

    await User.updateOne(
        { _id: userId, "cartitems._id": id },
        { $set: { "cartitems.$.quantity": quantity } }
    );

    return res.status(200).json({
        message: "Cart quantity updated successfully",
    });
};

export const removeAllFromCartByProductId = async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }
    const existingProduct = user.cartitems.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $pull: {
          cartitems: { productId },
        },
      }
    );

    return res.status(200).json({
      message: "Product removed from cart successfully",
    });

}


export const emptyCart = async (req, res) => {
    const userId = req.user._id;

    await User.updateOne(
        { _id: userId },
        {
            $set: {
                cartitems: [],
            },
        }
    );

    return res.status(200).json({
        message: "Cart emptied successfully",
    });
};