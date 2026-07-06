import express from "express";
import { getAllProducts, getFeaturedProducts,getRecommendedProducts,getProductsByCategory, createProduct,deleteProduct, toggleFeaturedProduct} from "../controllers/product.controller.js";
import { protectRoute,authorize} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protectRoute,authorize("admin"), getAllProducts);
router.get("/featured", getFeaturedProducts);
router.patch("/toggle-featured/:productId", toggleFeaturedProduct);
router.get("/recommended", getRecommendedProducts);
router.get("/category/:slug", getProductsByCategory);
router.post("/create", protectRoute,authorize("admin"),upload.single("image"), createProduct);
router.delete("/:id", protectRoute,authorize("admin"), deleteProduct);

export default router;