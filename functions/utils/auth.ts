
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('bootflow-secret-key-change-this'); // Em produção, usar variável de ambiente

export const createToken = async (payload: Record<string, unknown>) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
};

export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (err) {
        return null;
    }
};
