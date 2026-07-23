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

app.use(cors({
    origin: "http://localhost:8080", // your frontend
    credentials: true,
}));

app.use("/api/user", authRouter);
app.use("/api/order", orderRouter);

// query after insert
console.log(await prisma.user.findMany())

app.listen(process.env.PORT || 9000, () => {
    console.log("localhost:9000/");
})