import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("folder:pdfs") // Or your specific folder
      .sort_by("public_id", "desc")
      .max_results(50)
      .execute();

    const pdfs = result.resources.map((file: any) => {
      // Improved filename extraction (handles extensions)
      const filename = file.public_id.substring(file.public_id.lastIndexOf("/") + 1); // Get filename
      const title = filename.substring(0, filename.lastIndexOf('.')); // Remove extension if any.
      return {
        url: file.secure_url,
        public_id: file.public_id,
        title: title, // Use extracted filename
        filename: filename, // Include the filename
      };
    });

    return NextResponse.json({ pdfs }); // Return as { pdfs: [...] }

  } catch (error: any) {
    console.error("Get PDFs error:", error);
    return new NextResponse(error.message, { status: 500 }); // More robust error handling
  }
}