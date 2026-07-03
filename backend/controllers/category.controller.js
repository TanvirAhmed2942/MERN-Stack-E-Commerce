import Category from "../models/category.model.js";
import { redis_client as Redis } from "../lib/redis.js";
import { uploadToCloudinary, cloudinary } from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";
import e from "express";
import slugify from "slugify";


const normalize = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "");


export const getAllCategories = async (req, res) => {
  console.log("Fetching categories from database...");
  res.json({ message: "Categories fetched successfully" });
};

export const createCategory = async (req, res) => {
  try{
    const { name } = req.body;
    const normalized = normalize(name);
    const slug = slugify(name, { lower: true });
    let imageUrl = "";
    let publicId = "";
    // console.log("Received category data:", req.file);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      imageUrl = result.secure_url;
      publicId = result.public_id;
      console.log(result);
    }

    const newCategory = await Category.create({
      name:name,
      slug:slug,
      normalized:normalized,
      image:{url: imageUrl, public_id: publicId}
    });

    if (!newCategory) {
      return res.status(400).json({ message: "Failed to create category" });
    }
    res.status(201).json({ message: "Category created successfully", category: newCategory });

  }catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
};

export const editCategory = async (req, res) => {
  console.log("Editing category...");
  res.json({ message: "Category edited successfully" });
}

export const updateCategory = async (req, res) => {
  console.log("Updating category...");
  res.json({ message: "Category updated successfully" });
}

export const deleteCategory = async (req, res) => {
  console.log("Deleting category...");
  res.json({ message: "Category deleted successfully" });
}
