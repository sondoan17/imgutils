import { NextResponse } from "next/server";
import heicConvert from "heic-convert";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const format = formData.get("format") as string;

    if (!file || !format) {
      return NextResponse.json(
        { error: "File and format are required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    if (!(arrayBuffer instanceof ArrayBuffer)) {
      throw new Error("Invalid file format");
    }

    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const convertedBuffer = await heicConvert({
      buffer,
      format: format.toUpperCase() as "JPEG" | "PNG",
      quality: 1,
    });

    return new NextResponse(convertedBuffer, {
      headers: {
        "Content-Type": `image/${format.toLowerCase()}`,
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert image" },
      { status: 500 }
    );
  }
}
