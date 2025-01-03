import { NextResponse } from 'next/server';
import heicConvert from 'heic-convert';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Convert HEIC to JPEG/PNG buffer
    const convertedBuffer = await heicConvert({
      buffer,
      format: format.toUpperCase() as "JPEG" | "PNG",
      quality: 1
    });

    // Optimize the output using sharp
    const optimizedBuffer = await sharp(convertedBuffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    return new NextResponse(optimizedBuffer, {
      headers: {
        'Content-Type': `image/${format}`,
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'Failed to convert image' }, { status: 500 });
  }
} 