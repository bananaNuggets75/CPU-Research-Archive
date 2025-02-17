import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    // Parse FormData from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save the file temporarily on the server
    const tempPath = `/tmp/${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      resource_type: "auto", // Automatically detects and handles the file type
      folder: "pdfs",        // Store in "pdfs" folder in Cloudinary
      use_filename: true,    // Keep the original file name
      unique_filename: false // Prevent renaming
    });

    // Delete the temporary file after uploading
    await fs.unlink(tempPath);

    // Return the URL of the uploaded file
    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
