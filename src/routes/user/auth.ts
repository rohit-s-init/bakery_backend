import express, { Router } from "express";
import {
    registerUser,
    loginUser,
    verifyUser,
    getMe,
    logoutUser,
    googleLogin,
} from "../../controller/user.controller.js";
import { requireAuth } from "../../middleware/UseAuth.js";

const router = Router();

router.use(express.json());

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", requireAuth, getMe)
router.get("/logout", logoutUser);
router.post("/google-login", googleLogin);

export default router;