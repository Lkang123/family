import { NextRequest, NextResponse } from "next/server";
import { getMembers, saveMembers } from "@/lib/data";

export async function GET() {
  const members = getMembers();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const member = await req.json();
  const members = getMembers();
  members.push(member);
  saveMembers(members);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const updated = await req.json();
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === updated.id);
  if (idx === -1) {
    return NextResponse.json({ success: false, message: "成员不存在" }, { status: 404 });
  }
  members[idx] = updated;
  saveMembers(members);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let members = getMembers();
  members = members.filter((m) => m.id !== id);
  saveMembers(members);
  return NextResponse.json({ success: true });
}
