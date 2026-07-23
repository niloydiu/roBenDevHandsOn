import { NextResponse } from "next/server";
import { seedTeams } from "@/lib/data";

export async function GET() {
  return NextResponse.json(seedTeams);
}
