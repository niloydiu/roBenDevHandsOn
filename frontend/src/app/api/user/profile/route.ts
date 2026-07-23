import { NextResponse } from "next/server";
import { seedUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  let user = seedUsers[0];
  if (token && token.includes(".")) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.email) {
        const found = seedUsers.find((u) => u.email === payload.email);
        if (found) {
          user = found;
        } else {
          user = { ...seedUsers[0], name: payload.name || "Volunteer", email: payload.email };
        }
      }
    } catch (e) {
      user = seedUsers[0];
    }
  }

  return NextResponse.json({
    success: true,
    user
  });
}
