import { NextRequest, NextResponse } from "next/server";
import { getEvents, saveEvents } from "@/lib/data";

export async function GET() {
  const events = getEvents();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const event = await req.json();
  const events = getEvents();
  events.push(event);
  saveEvents(events);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const updated = await req.json();
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === updated.id);
  if (idx === -1) {
    return NextResponse.json({ success: false, message: "事件不存在" }, { status: 404 });
  }
  events[idx] = updated;
  saveEvents(events);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let events = getEvents();
  events = events.filter((e) => e.id !== id);
  saveEvents(events);
  return NextResponse.json({ success: true });
}
