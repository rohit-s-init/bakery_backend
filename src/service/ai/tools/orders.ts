import { tool } from "ai";
import { z } from "zod";
// import { addOrder } from 

import { addOrder, getOrdersByUserId } from "../../db/order.js";

const MENU = [
    {
        id: 1,
        name: "Rose Macarons",
        price: 3.5,
        description: "Delicate almond shells with rose cream",
        tag: "Bestseller",
    },
    {
        id: 2,
        name: "Butter Croissants",
        price: 4.2,
        description: "72-hour laminated with French butter",
        tag: "Fresh Daily",
    },
    {
        id: 3,
        name: "Berry Tartlet",
        price: 6.8,
        description: "Vanilla custard with wild berries",
        tag: "Seasonal",
    },
    {
        id: 4,
        name: "Dark Chocolate Éclair",
        price: 5.5,
        description: "Choux pastry, ganache, crème pâtissière",
        tag: "Classic",
    },
    {
        id: 5,
        name: "Strawberry Fraisier",
        price: 8.9,
        description: "Génoise, cream, fresh strawberries",
        tag: "Signature",
    },
    {
        id: 6,
        name: "Palette Assortment",
        price: 28,
        description: "A curated box of six pastries",
        tag: "Gift",
    },
];

export function createBakeryTools(userId: number) {
    return {
        showMenu: tool({
            description:
                "Show the complete bakery menu whenever the user asks about cakes, pastries, desserts, bakery items, products or menu.",

            inputSchema: z.object({}),

            execute: async () => {
                console.log("sending menu");
                return {
                    success: true,
                    menu: MENU,
                };
            },
        }),

        getOrders: tool({
            description:
                "Get all previous orders of the currently logged in user.",

            inputSchema: z.object({}),

            execute: async () => {
                const orders = await getOrdersByUserId(userId);

                return {
                    success: true,
                    orders,
                };
            },
        }),

        placeOrder: tool({
            description:
                "Create a bakery order after collecting all required information from the user.",

            inputSchema: z.object({
                productName: z.string().describe("Exact product name"),
                quantity: z.number().min(1),
                phoneNo: z.string(),
                address: z.string(),
            }),

            execute: async ({
                productName,
                quantity,
                phoneNo,
                address,
            }) => {

                const product = MENU.find(
                    (item) =>
                        item.name.toLowerCase() ===
                        productName.toLowerCase()
                );

                if (!product) {
                    throw new Error(
                        "Product not found in bakery menu."
                    );
                }

                const order = await addOrder({
                    userId,
                    quantity,
                    totalAmount: product.price * quantity,
                    productName: product.name,
                    productDescription: product.description,
                    phoneNo,
                    address,
                });

                return {
                    success: true,
                    message: "Order placed successfully.",
                    order,
                };
            },
        }),
    };
}

