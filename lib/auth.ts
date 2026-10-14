import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_cambiar_en_produccion",
);

export async function crearToken() {
  const token = await new SignJWT({ rol: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
  return token;
}

export async function verificarToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export function verificarPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}