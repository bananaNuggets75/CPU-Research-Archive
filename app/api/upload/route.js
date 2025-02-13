import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";

const upload = multer({ dest: "/tmp" }); // Temporary storage
const uploadMiddleware = promisify(upload.single("file"));

export async function POST(req) {
  try {
    await uploadMiddleware(req);
    const file = req.file;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "pdfs", // Store PDFs in a specific folder
    });

    // Delete temporary file
    fs.unlinkSync(file.path);

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
