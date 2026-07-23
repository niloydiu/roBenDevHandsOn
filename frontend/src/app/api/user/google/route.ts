import { NextResponse } from "next/server";
import { seedUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const mockToken = body.token || "mock-jwt-token-12345";
  return NextResponse.json({
    success: true,
    token: mockToken,
    message: "Google authentication successful",
    user: seedUsers[0]
  });
}
