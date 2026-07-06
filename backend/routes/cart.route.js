import express from "express";
import {getAllCartItems,addToCart,removeAllFromCart,updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute,authorize} from "../middleware/auth.middleware.js";
// import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllCartItems);
router.post("/add-to-cart", protectRoute, addToCart);
router.post("/remove-all", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);



export default router;