import type { Message } from "../../generated/prisma/client.js";
import { getAiResponse } from "../service/ai/ai.js";
import { addConversation, addMessage, getRecentMessages } from "../service/db/message.js";
import express from "express";

export async function getAllMessages(req: express.Request, res: express.Response) {
    try {
        const recentMessages = await getRecentMessages(req.user.id);
        return res.json({
            success: true,
            messages: recentMessages
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err instanceof Error ? err.message : "Something went wrong",
        });
    }
}

export async function insertMessage(req: express.Request, res: express.Response) {
    // res.json(getRecentMessages(req.user.id));

    try {
        console.log("req body is ");
        console.log(req.body);
        if (!req.body.content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message content is required.",
            });
        }
        // const messages = await addMessage(req.user.id, "USER", req.body.content);
        console.log("getting recent messages");
        const messages: Message[] = await getRecentMessages(req.user.id);
        console.log(messages);
        console.log("ai resp");
        const resp = await getAiResponse(req.user.id, messages.map(mess => {
            return {
                role: mess.role == "USER" ? "user" : "assistant",
                content: mess.content
            }
        }), req.body.content);
        console.log(resp);

        console.log("setting the database");
        const dbResp = await addConversation(req.user.id, req.body.content, resp.text);
        console.log(dbResp);

        res.status(200).json({
            success: true,
            bot: resp
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err instanceof Error ? err.message : "Something went wrong",
        });
    }

}
