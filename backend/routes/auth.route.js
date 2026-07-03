import express from "express";
import { signup,login,logout,accessTokenbyRefreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", accessTokenbyRefreshToken);

export default router;

// tanvirahmed3264_db_user
// tA2q4IhWvr2v6lz4