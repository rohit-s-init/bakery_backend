import express from "express";
import { groq, type GroqLanguageModelChatOptions } from '@ai-sdk/groq';
import { generateText, tool } from 'ai';
import dotenv from "dotenv";
import z from "zod";
import fs from "node:fs/promises"
import path from "node:path";
import httpProxy from 'http-proxy';
import prisma from "../prisma/client.js";
import { sendMail } from "./service/mail/mails.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/user/auth.js";
import orderRouter from "./routes/order/order.js";


dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:8080",          // local development
    "https://bakery-frontend-sandy.vercel.app", // deployed frontend
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests without an Origin header (Postman, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use("/api/user", authRouter);
app.use("/api/order", orderRouter);

app.get("/",(req,res)=>{
    res.send("Hello From THe Bakery Backend");
})

// query after insert
console.log(await prisma.user.findMany())

app.listen(process.env.PORT || 9000, () => {
    console.log("localhost:9000/");
})