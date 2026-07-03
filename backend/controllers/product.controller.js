import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

import { redis_client as Redis } from "../lib/redis.js";
import { uploadToCloudinary, cloudinary } from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";
import e from "express";

export const getAllProducts = async (req, res) => {
  console.log("Fetching products from database...");
  res.json({ message: "Products fetched successfully" });
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 3 } },
       { $project: {
            name: 1,
            description: 1,
            price: 1,
            images: 1,
        },
      } 
    ]);
    res.status(200).json({ message: "Recommended products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  console.log("Fetching featured products from database...");
  res.status(200).json({ message: "Featured products fetched successfully" });
};

export const getProductsByCategory = async (req, res) => {
  try{
    const {  slug } = req.params;
    const category = await Category.findOne({ slug: slug });
    if(!category){
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await Product.find({category: category._id});
    if(products.length === 0){
      return res.status(404).json({ message: "No products found for this category" });
    }
    const result = products.map(product => ({
      name: product.name,
      description: product.description, 
      price: product.price,
      category: category.name,
      images: product.images.map(image => image.url),
    }));
    res.status(200).json({ message: `Products by category : (${category.name}) fetched successfully`, products: result });
  } catch (error) {
    console.error("Error fetching products by category:", error.message);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    console.log("Received product data:", {
      name,
      description,
      price,
      category,
    });
    console.log("Received file:", req.file);
    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      publicId = result.public_id;
      console.log(result);
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images: [{ url: imageUrl, public_id: publicId }],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findById(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    // console.log("Deleting product:", deletedProduct.images);
    // Delete all images
    for (const image of deletedProduct.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    await Product.findByIdAndDelete(id);
    res.json(
      { message: "Product deleted successfully" },
      { deleteProduct: deletedProduct },
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
