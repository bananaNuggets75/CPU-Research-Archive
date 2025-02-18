import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get('public_id');

    if (!public_id) {
      return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw"
    });

    if (result.result === 'ok') {
      return NextResponse.json({ message: "File deleted successfully" });
    } else {
      console.error("Cloudinary delete error:", result);
      return NextResponse.json({ error: "Error deleting from Cloudinary" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}