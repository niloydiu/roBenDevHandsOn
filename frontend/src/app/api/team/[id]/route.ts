import { NextResponse } from "next/server";
import { seedTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = seedTeams.find((t) => t.id === id || (t as any)._id === id);
  if (team) {
    return NextResponse.json(team);
  }
  return NextResponse.json(seedTeams[0]);
}
