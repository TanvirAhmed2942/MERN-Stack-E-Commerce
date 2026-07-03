import express from "express";
import { createCategory,editCategory,updateCategory,deleteCategory,getAllCategories} from "../controllers/category.controller.js";
import { protectRoute,authorize} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllCategories);
router.post("/create", protectRoute,authorize("admin"),upload.single("image"), createCategory);
router.put("/:id", protectRoute,authorize("admin"),editCategory);
router.patch("/:id", protectRoute,authorize("admin"),updateCategory);
router.delete("/:id", protectRoute,authorize("admin"), deleteCategory);


export default router;