import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    // Validate base64 image
    if (!imageUrl.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    const response = await fetch('https://api.hyperbolic.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2-VL-72B-Instruct',
        messages: [
          {
            role: 'user',
            content: [
              { 
                type: "text", 
                text: 'Suggest 3 creative and engaging text overlays for this image. Each suggestion should be short (2-5 words) and capture the mood or theme of the image. Format the response as a simple list with one suggestion per line.'
              },
              { 
                type: "image_url", 
                image_url: { 
                  url: imageUrl 
                } 
              }
            ]
          }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      }),
    });

    const data = await response.json();
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response structure');
    }

    const suggestions = data.choices[0].message.content;

    if (typeof suggestions !== 'string') {
      throw new Error('Invalid suggestions format');
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to generate text suggestions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}