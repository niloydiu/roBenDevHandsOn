import { NextRequest, NextResponse } from "next/server";
import { seedTeams } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  const start = (page - 1) * limit;
  const paginatedTeams = seedTeams.slice(start, start + limit);

  return NextResponse.json({
    teams: seedTeams,
    data: paginatedTeams,
    total: seedTeams.length,
    page,
    limit,
    totalPages: Math.ceil(seedTeams.length / limit)
  });
}
