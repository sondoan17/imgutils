import { NextResponse } from 'next/server';
import heicConvert from 'heic-convert';
import sharp from 'sharp';

// Define proper types for heicConvert
type HeicConvertOptions = {
  buffer: Uint8Array;
  format: 'JPEG' | 'PNG';
  quality: number;
};

type HeicConvertFunction = (options: HeicConvertOptions) => Promise<Buffer>;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const convertedBuffer = await (heicConvert as HeicConvertFunction)({
      buffer: uint8Array,
      format: format.toUpperCase() as "JPEG" | "PNG",
      quality: 1
    });

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