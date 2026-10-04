import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data." },
        { status: 400 }
      );
    }

    // Sanitize filename
    const originalName = file.name || "upload";
    const extension = path.extname(originalName) || "";
    const baseName = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${Date.now()}-${baseName}${extension}`;

    // Target directory: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const filePath = path.join(uploadDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      originalName,
      size: file.size,
      mimeType: file.type,
      message: "File uploaded successfully.",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process upload." },
      { status: 500 }
    );
  }
}
