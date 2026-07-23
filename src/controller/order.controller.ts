import express from "express";
import { addOrder, getOrdersByUserId } from "../service/db/order.js";

export async function createOrder(req: express.Request, res: express.Response) {
    try {
        const order = await addOrder({
            userId: req.user.id,
            quantity: req.body.quantity,
            totalAmount: req.body.totalAmount,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            phoneNo: req.body.phoneNo,
            address: req.body.address,
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err instanceof Error ? err.message : "Something went wrong",
        });
    }
}

export async function getUserOrders(req: express.Request, res: express.Response) {
    try {
        const userId = Number(req.user.id);

        const orders = await getOrdersByUserId(userId);

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err instanceof Error ? err.message : "Something went wrong",
        });
    }
}