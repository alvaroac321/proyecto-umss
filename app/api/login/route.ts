import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { crearToken, verificarPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!verificarPassword(password)) {
      return NextResponse.json(
        { ok: false, error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    const token = await crearToken();

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { ok: false, error: "Error del servidor" },
      { status: 500 },
    );
  }
}