import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://api.hyperbolic.xyz/v1/image/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
      },
      body: JSON.stringify({
        'model_name': 'SD1.5',
        'prompt': prompt,
        'steps': 30,
        'cfg_scale': 5,
        'enable_refiner': false,
        'height': 1024,
        'width': 1024,
        'backend': 'auto'
      }),
    });

    const data = await response.json();
    return NextResponse.json({ imageUrl: data.images[0] });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}