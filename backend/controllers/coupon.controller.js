import Coupon from "../models/Coupon.model.js";
import { redis_client as Redis } from "../lib/redis.js";
import e from "express";

export const getAllCoupons = async (req, res) => {
    try{
        const coupons = await Coupon.find({user: req.user._id,isActive: true});
        if(!coupons){
            return res.status(404).json({ message: "No coupons found for this user" });
        }
        res.status(200).json({ message: "Get all coupons", totalCoupons: coupons.length || [], coupons });

    }catch(err){
        console.log('Error fetching coupons:', err.message);
        res.status(500).json({ message: "Internal server error" +err.message});
    }
}

export const createCoupon = async (req, res) => {
    try{
        
        const { code, discount, expirationDate } = req.body;
        console.log('Creating coupon with data:', { code, discount, expirationDate, userId: req.user._id });
        if (!code || !discount ) {
            return res.status(400).json({ message: "Code, discount, and expiration date are required" });
        }

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({
            code,
            discount,
            expirationDate,
            user: req.user._id
        });

        await newCoupon.save();
        res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });

    }catch(err){
        console.log('Error creating coupon:', err.message);
        res.status(500).json({ message: "Internal server error" +err.message});
    }
}

export const updateCoupon = async (req, res) => {
    try{
        const { id } = req.params;
        const { code, discount, expirationDate, isActive } = req.body;
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { code, discount, expirationDate, isActive },
            { new: true, runValidators: true }
        );
        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (err) {
        console.log('Error updating coupon:', err.message);
        res.status(500).json({ message: "Internal server error" + err.message });
    }
}

export const deleteCoupon = async (req, res) => {}



