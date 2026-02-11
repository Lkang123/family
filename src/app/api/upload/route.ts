import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    ensureDir(UPLOAD_DIR);

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ success: false, message: "没有选择文件" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 生成唯一文件名
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      fs.writeFileSync(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, message: "上传失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    const filename = path.basename(url);
    const filepath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ success: false, message: "删除失败" }, { status: 500 });
  }
}
