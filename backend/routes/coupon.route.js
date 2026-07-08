import express from "express";
import { getAllCoupons,createCoupon,updateCoupon,deleteCoupon} from "../controllers/coupon.controller.js";
import { protectRoute,authorize} from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", protectRoute, getAllCoupons);
router.post("/create", protectRoute,authorize("admin"), createCoupon);
router.patch("/:id", protectRoute,authorize("admin"),updateCoupon);
router.delete("/:id", protectRoute,authorize("admin"), deleteCoupon);


export default router;