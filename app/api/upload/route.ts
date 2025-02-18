// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import { uploadPDF } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const tempPath = `/tmp/${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Use the uploadPDF function instead
    const result = await uploadPDF(tempPath);

    await fs.unlink(tempPath);

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
