import express from "express";
import { verifyToken } from "../service/jwt/jwt.js";
import type { UserPayload } from "../types/user.interface.js";

export async function requireAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const payload: UserPayload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }

    req.user = payload;

    next();
}