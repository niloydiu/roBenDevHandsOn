import { NextResponse } from "next/server";
import { seedHelpRequests } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    helpRequests: seedHelpRequests
  });
}
