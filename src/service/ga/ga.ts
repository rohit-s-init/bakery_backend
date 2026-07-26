import { ga, type GaArgs } from "ga4-node"
import express from "express";
import dotenv from "dotenv";
dotenv.config();

export default async function emitGa(req: express.Request, events: GaArgs["events"]) {
    return await ga({
        req,
        apiSecret: process.env.GA_API_SECRET!,
        measurementId: process.env.GA_MEASUREMENT_ID!,
        events: events
    })
}
