// src/interface/user.ts

export interface RegisterDAO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDAO {
    email: string;
    password: string;
}

export interface VerifyDAO {
    email: string;
    otp: number;
}

export interface UserDAO {
    id: number;
    name: string;
    email: string;
    password: string;
    otp: number | null;
    verified: boolean;
}

export interface UserPayload {
    id: number;
    email: string;
    name: string;
    verified: boolean;

}