import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    // Fetch all PDFs from the "pdfs" folder in Cloudinary
    const resources = await cloudinary.search
      .expression("folder:pdfs")
      .sort_by("public_id", "desc")
      .max_results(100) // Adjust limit as needed
      .execute();

    // Extract relevant details
    const pdfs = resources.resources.map((pdf: any) => ({
      title: pdf.public_id.split('/').pop(), // Extracts filename
      url: pdf.secure_url,
    }));

    return NextResponse.json(pdfs);
  } catch (error: any) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
