import { NextResponse } from "next/server";
import { seedHelpRequests } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    success: true,
    helpRequests: seedHelpRequests
  });
}
