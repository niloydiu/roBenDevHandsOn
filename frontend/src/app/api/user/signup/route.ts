import { NextResponse } from "next/server";
import { seedUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    token: "mock-jwt-token-signup-success",
    message: "Account created successfully",
    user: { ...seedUsers[0], name: body.name || "New Volunteer", email: body.email || "new@handson.org" }
  });
}
