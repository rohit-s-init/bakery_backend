import express from "express";
import { register, login, verify, getByEmail, getUserById, createGoogleUser } from "../service/db/user.js";
import { sendOtpTo } from "../service/mail/mails.js";
import type { LoginDAO, RegisterDAO, UserDAO, VerifyDAO } from "../types/user.interface.js";
import { generateToken } from "../service/jwt/jwt.js";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function registerUser(req: express.Request, res: express.Response) {
    try {
        const data: RegisterDAO = req.body;

        const { user, otp } = await register(data);

        await sendOtpTo(user.name as string, user.email as string, otp);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export async function verifyUser(req: express.Request, res: express.Response) {
    try {
        const data: VerifyDAO = req.body;

        await verify(data.email, data.otp);

        const user = await getByEmail(data.email);

        const token = generateToken(user.id, user.email as string);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie("user", JSON.stringify({
            id: user.id,
            name: user.name,
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export async function loginUser(req: express.Request, res: express.Response) {
    try {
        const data: LoginDAO = req.body;

        console.log(data);

        const user = await login(data.email, data.password);

        console.log(user);

        const token = generateToken(user.id, user.email as string);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie("user", JSON.stringify({
            id: user.id,
            name: user.name,
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        res.status(200).json({
            success: true,
            user,
        });
    } catch (err: any) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export async function getMe(req: express.Request, res: express.Response) {
    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function logoutUser(req: express.Request, res: express.Response) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function googleLogin(req: express.Request, res: express.Response) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Google token is required.",
            });
        }

        const googleClientId = process.env.GOOGLE_CLIENT_ID;

        if (!googleClientId) {
            return res.status(500).json({
                success: false,
                message: "Google client ID is not configured.",
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleClientId,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(401).json({
                success: false,
                message: "Invalid Google token.",
            });
        }

        const user = await createGoogleUser(
            payload.email,
            payload.name ?? ""
        );

        const jwt = generateToken(user.id, user.email as string);

        res.cookie("token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.error(err);

        return res.status(401).json({
            success: false,
            message: "Google authentication failed.",
        });
    }
}