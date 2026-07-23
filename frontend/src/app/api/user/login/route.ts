import { NextResponse } from "next/server";
import { seedUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email } = body;
  const user = seedUsers.find((u) => u.email === email) || seedUsers[0];
  return NextResponse.json({
    success: true,
    token: "mock-jwt-token-login-success",
    message: "Login successful",
    user
  });
}
