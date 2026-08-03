import { Router } from "express";
import { getRecentMessages } from "../../service/db/message.js";
import { getAllMessages, insertMessage } from "../../controller/ai.controller.js";
import { requireAuth } from "../../middleware/UseAuth.js";
import express from "express";

const router = Router();

router.use(express.json());

router.get("/allmessages", requireAuth, getAllMessages);
router.post("/insertmessage", requireAuth, insertMessage);

export default router;



