import prisma from "../../../prisma/client.js";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

export async function register(data: {
    name: string;
    email: string;
    password: string;
}) {
    const existing = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existing && existing.verified) {
        throw new Error("Email already exists");
    }

    const otp = generateOTP();

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            otp,
            verified: false,
        },
    });

    return {
        user,
        otp,
    };
}

export async function verify(email: string, otp: number) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.verified) {
        throw new Error("User already verified");
    }

    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    return prisma.user.update({
        where: {
            email,
        },
        data: {
            verified: true,
            otp: null,
        },
    });
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.verified) {
        throw new Error("Please verify your email first");
    }

    if (user.password !== password) {
        throw new Error("Incorrect password");
    }

    return user;
}

export async function getByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            verified: true,
        },
    });
}

export async function createGoogleUser(email: string, name: string) {
    const existing = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existing) {
        return existing;
    }

    const user = await prisma.user.create({
        data: {
            email,
            name,
            verified: true,
        },
    });

    return user;
}