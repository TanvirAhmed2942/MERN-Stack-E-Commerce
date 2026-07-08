import express from "express";
import {getAllCartItems,addToCart,removeAllFromCartByProductId,updateQuantity,emptyCart } from "../controllers/cart.controller.js";
import { protectRoute,authorize} from "../middleware/auth.middleware.js";
// import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllCartItems);
router.post("/add-to-cart", protectRoute, addToCart);
router.post("/remove-all-by-product-id", protectRoute, removeAllFromCartByProductId);
router.patch("/update-quantity/:id", protectRoute, updateQuantity);
router.get("/empty-cart", protectRoute, emptyCart);



export default router;