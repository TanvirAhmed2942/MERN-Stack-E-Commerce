
import { redis_client as Redis } from "../lib/redis.js";
import e from "express";


export const getAllCartItems = async (req, res) => {
    res.status(200).json({ message: "Get all cart items" });
}

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    res.status(200).json({ message: "Item added to cart" });
}

export const updateQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;}

export const removeAllFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;}