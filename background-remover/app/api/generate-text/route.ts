import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.HYPERBOLIC_API_KEY,
  baseURL: 'https://api.hyperbolic.xyz/v1',
});

export async function POST() {
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a creative assistant helping users generate text for their images. Provide 3 short, creative text suggestions.'
        },
        {
          role: 'user',
          content: 'I need some creative text suggestions for an image I\'m working on. Keep them short (1-3 words) and catchy.'
        }
      ],
      model: 'Qwen/QwQ-32B-Preview',
    });

    return NextResponse.json({ suggestions: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}