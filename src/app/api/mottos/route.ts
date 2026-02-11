import { NextRequest, NextResponse } from "next/server";
import { getMottos, saveMottos } from "@/lib/data";

export async function GET() {
  const data = getMottos();
  return NextResponse.json(data.mottos);
}

export async function POST(req: NextRequest) {
  const motto = await req.json();
  const data = getMottos();
  data.mottos.push(motto);
  saveMottos(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { index } = await req.json();
  const data = getMottos();
  data.mottos.splice(index, 1);
  saveMottos(data);
  return NextResponse.json({ success: true });
}
