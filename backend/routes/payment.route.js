import express from "express";
import { createCheckOutSession} from "../controllers/payment.controller.js";
import { protectRoute,authorize} from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/checkout", protectRoute,authorize("admin"), createCheckOutSession);


export default router;