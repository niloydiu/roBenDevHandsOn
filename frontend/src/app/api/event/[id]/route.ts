import { NextResponse } from "next/server";
import { seedEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = seedEvents.find((e) => e.id === id || (e as any)._id === id);
  if (event) {
    return NextResponse.json({ success: true, event });
  }
  
  // Default to first event if not found
  return NextResponse.json({ success: true, event: seedEvents[0] });
}
