import prisma from "../../../prisma/client.js";

export async function addOrder(data: {
    userId: number;
    quantity: number;
    totalAmount: number;
    productName: string;
    productDescription: string;
    phoneNo: string;
    address: string;
}) {
    const user = await prisma.user.findUnique({
        where: {
            id: data.userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.order.create({
        data: {
            userId: data.userId,
            quantity: data.quantity,
            totalAmount: data.totalAmount,
            productName: data.productName,
            productDescription: data.productDescription,
            phoneNo: data.phoneNo,
            address: data.address,
        },
    });
}

export async function getOrdersByUserId(userId: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.order.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}