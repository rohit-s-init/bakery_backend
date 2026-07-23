import express, { Router } from "express";
import { requireAuth } from "../../middleware/UseAuth.js";
import { createOrder, getUserOrders } from "../../controller/order.controller.js";

const router = Router();

router.use(express.json());

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getUserOrders);


export default router;