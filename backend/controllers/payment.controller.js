
import { redis_client as Redis } from "../lib/redis.js";
import stripe from "../lib/stripe.js";
import jwt from "jsonwebtoken";
import e from "express";

export const createCheckOutSession = async (req, res) => {
  try{
    const { orders, coupon } = req.body;

    if (!orders || orders.length === 0) {
      return res.status(400).json({ message: "No orders provided" });
    }
  }catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}