import { tool } from "ai";
import { z } from "zod";
import type { AiBehaviourPrediction } from "../../../types/ai.interface.js";



export function createAiBehaviourTools() {
    let aiBehaviourPrediction: AiBehaviourPrediction = null;

    const tools = {
        cakeEnquiry: tool({
            description:
                "Call this when the user's primary intent is to browse or enquire about cakes, pastries, desserts, menu items, flavours, or bakery products.",

            inputSchema: z.object({}),

            execute: async () => {
                aiBehaviourPrediction = "cake_enquiry";

                return {
                    success: true,
                };
            },
        }),

        servicesEnquiry: tool({
            description:
                "Call this when the user's primary intent is to enquire about bakery services such as catering, custom cakes, delivery, events, or other available services.",

            inputSchema: z.object({}),

            execute: async () => {
                aiBehaviourPrediction = "services_enquiry";

                return {
                    success: true,
                };
            },
        }),

        aboutUsEnquiry: tool({
            description:
                "Call this when the user asks about the bakery, company, history, mission, location, or other business information.",

            inputSchema: z.object({}),

            execute: async () => {
                aiBehaviourPrediction = "about_us_enquiry";

                return {
                    success: true,
                };
            },
        }),

        purchaseIntentDetected: tool({
            description:
                "Call this ONLY when the user clearly expresses an intention to purchase or start placing an order. This tool is ONLY for analytics and DOES NOT create an order.",

            inputSchema: z.object({}),

            execute: async () => {
                aiBehaviourPrediction = "purchase_Intent_Detected";

                return {
                    success: true,
                };
            },
        }),

        orderAbandoned: tool({
            description:
                "Call this when the user was interested in placing an order but later decided not to continue, postpone, or cancel the ordering process.",

            inputSchema: z.object({}),

            execute: async () => {
                aiBehaviourPrediction = "order_abandoned";

                return {
                    success: true,
                };
            },
        }),

        complaint: tool({
            description:
                "Call this when the user reports dissatisfaction, raises a complaint, expresses frustration, or reports a problem with products or services.",

            inputSchema: z.object({}),

            execute: async () => {
                aiBehaviourPrediction = "complaint";

                return {
                    success: true,
                };
            },
        }),
    };

    return {
        tools,
        getPrediction: () => aiBehaviourPrediction,
        resetPrediction: () => {
            aiBehaviourPrediction = null;
        },
    };
}