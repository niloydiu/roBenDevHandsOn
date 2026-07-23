import { NextResponse } from "next/server";
import { seedTeams } from "@/lib/data";

export async function GET() {
  const leaderboard = [...seedTeams].sort((a, b) => b.hoursContributed - a.hoursContributed).slice(0, 10);
  return NextResponse.json(leaderboard);
}
