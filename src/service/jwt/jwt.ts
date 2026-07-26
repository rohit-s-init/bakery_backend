import jwt from "jsonwebtoken";
import type { UserPayload } from "../../types/user.interface.js";

const SECRET = process.env.JWT_SECRET!;

export function generateToken(id: number, email: string,name : string, verified: boolean ) {
    return jwt.sign(
        {
            id,
            email,
            name,
            verified
        },
        SECRET,
        {
            expiresIn: "7d",
        }
    );
}

export function verifyToken(token: string): UserPayload {
    return jwt.verify(token, SECRET) as UserPayload;
}