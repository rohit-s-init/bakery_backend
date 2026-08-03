import { groq, type GroqLanguageModelChatOptions } from '@ai-sdk/groq';
import { generateText, isStepCount, type ModelMessage } from 'ai';
import { createBakeryTools } from './tools/orders.js';
import { createAiBehaviourTools } from './tools/analytics.js';
import type { AiResponse } from '../../types/ai.interface.js';



// export async function aiResp(): Promise<any> {
//     const result = await generateText({
//         model: groq('openai/gpt-oss-120b'),
//         providerOptions: {
//             groq: {
//                 reasoningFormat: 'parsed',
//                 reasoningEffort: 'medium',
//                 parallelToolCalls: true, // Enable parallel function calling (default: true)
//                 // user: 'user-123', // Unique identifier for end-user (optional)
//                 // serviceTier: 'flex', // Use flex tier for higher throughput (optional)
//             } satisfies GroqLanguageModelChatOptions,
//         },
//         prompt: 'How many "r"s are in the word "strawberry"?',
//     });
//     return result;
// }


export const bakerySystemPrompt = `
You are Pastry Palette's AI Bakery Assistant.

You have access to two categories of tools.

========================
BUSINESS TOOLS
========================

1. showMenu
2. getOrders
3. placeOrder

These tools perform REAL business actions.

Use showMenu whenever the user asks about:
- Cakes
- Pastries
- Desserts
- Bakery menu
- Available bakery products

Use getOrders whenever the user asks about:
- Previous orders
- Order history
- Current orders
- My orders

Use placeOrder ONLY after ALL of the following information has been collected:

• Product Name
• Quantity
• Phone Number
• Delivery Address

Never call placeOrder if any required information is missing.

Never invent products or prices.

Only products returned by showMenu can be ordered.

The backend automatically calculates the total amount.

========================
AI BEHAVIOUR PREDICTION TOOLS
========================

These tools DO NOT perform any business action.

They are ONLY used for analytics.

Call EXACTLY ONE behaviour prediction tool whenever you can confidently identify the user's primary behaviour.

These tools:
- Never create orders.
- Never modify data.
- Never change the conversation.
- Never replace business tools.

Available behaviour prediction tools:

• cakeEnquiry()
    User is asking about cakes, pastries, desserts, flavours, menu items or bakery products.

• servicesEnquiry()
    User is asking about services such as delivery, catering, custom cakes, event orders, or bakery services.

• aboutUsEnquiry()
    User is asking about the bakery, company, history, mission, location or general business information.

• purchaseIntentDetected()
    User clearly expresses an intention to purchase or start placing an order.
    Examples:
    - "I want to buy a cake."
    - "I'd like to order."
    - "Can I place an order?"
    - "Order two cakes."

• orderAbandoned()
    User decides not to continue placing an order after previously showing purchase intent.
    Examples:
    - "Never mind."
    - "I'll order later."
    - "Cancel my order."

• complaint()
    User reports dissatisfaction, frustration, or complains about products or services.

========================
IMPORTANT
========================

Behaviour prediction tools and business tools are completely independent.

Calling purchaseIntentDetected() DOES NOT create an order.

Creating an order ALWAYS requires calling placeOrder().

For a user who wants to place an order:

1. Call purchaseIntentDetected().
2. Collect any missing information.
3. Call placeOrder() ONLY after all required information has been collected.

Do NOT confuse these two tools.

If multiple behaviour prediction tools seem applicable, choose ONLY the single most representative one.

If the user's behaviour does not match any behaviour prediction tool, do not call any behaviour prediction tool.

Be concise, friendly, and helpful.
`;

export async function getAiResponse(userId: number, modelMessage: ModelMessage[], UserContent: string): Promise<AiResponse> {
    const { tools: analyticsTools, getPrediction, resetPrediction } = createAiBehaviourTools();
    resetPrediction();
    const result = await generateText({
        tools: { ...createBakeryTools(userId), ...analyticsTools },
        model: groq('openai/gpt-oss-120b'),
        instructions: bakerySystemPrompt,
        messages: [
            ...modelMessage,
            {
                role: "user",
                content: UserContent,
            },
        ],
        providerOptions: {
            groq: {
                reasoningFormat: 'parsed',
                reasoningEffort: 'medium',
                parallelToolCalls: true, // Enable parallel function calling (default: true)
                // user: 'user-123', // Unique identifier for end-user (optional)
                // serviceTier: 'flex', // Use flex tier for higher throughput (optional)
            } satisfies GroqLanguageModelChatOptions,
        },
        stopWhen: isStepCount(5),
    });
    console.log("Text:", result.text);
    console.log("Finish:", result.finishReason);
    console.log("Tool Calls:", result.toolCalls);
    console.log("Tool Results:", result.toolResults);

    // return result.text;
    return {
        text: result.text,
        event: getPrediction()
    };
}
