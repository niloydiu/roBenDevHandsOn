import { NextRequest, NextResponse } from "next/server";
import { seedHelpRequests } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const start = (page - 1) * limit;
  const paginatedRequests = seedHelpRequests.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    helpRequests: seedHelpRequests,
    data: paginatedRequests,
    total: seedHelpRequests.length,
    page,
    limit,
    totalPages: Math.ceil(seedHelpRequests.length / limit)
  });
}
