import { NextResponse } from "next/server";
import { seedEvents } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    success: true,
    events: seedEvents
  });
}
