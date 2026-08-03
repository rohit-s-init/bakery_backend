import type { Message } from "../../../generated/prisma/client.js";
import prisma from "../../../prisma/client.js";

/**
 * Get the 10 most recent messages of a user.
 * Returns them in chronological order (oldest -> newest).
 */
export async function getRecentMessages(userId: number): Promise<Message[]> {
    const messages = await prisma.message.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });

    // Reverse so the frontend receives them in chat order
    return messages.reverse();
}

/**
 * Add a new message.
 */
export async function addMessage(userId: number, role: "USER" | "ASSISTANT", content: string) {
    return await prisma.message.create({
        data: {
            userId,
            role,
            content,
        },
    });
}

/**
 * Save both the user's message and the assistant's reply.
 * If either insert fails, neither message is saved.
 */
export async function addConversation(
    userId: number,
    userMessage: string,
    assistantMessage: string
): Promise<[Message, Message]> {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.message.create({
            data: {
                userId,
                role: "USER",
                content: userMessage,
            },
        });

        const assistant = await tx.message.create({
            data: {
                userId,
                role: "ASSISTANT",
                content: assistantMessage,
            },
        });

        return [user, assistant];
    });
}