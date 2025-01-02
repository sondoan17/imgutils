import { NextResponse } from 'next/server';
import ApiKeyManager from '@/app/utils/apiKeyManager';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const currentKey = ApiKeyManager.getCurrentKey();
    
    if (!currentKey) {
      throw new Error('No API keys available');
    }

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': currentKey,
        },
        body: formData,
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/png',
          },
        });
      }

      // If rate limit or invalid key, try next key
      if (response.status === 402 || response.status === 401) {
        const nextKey = ApiKeyManager.rotateKey();
        if (!nextKey) {
          throw new Error('All API keys exhausted');
        }
        // Retry with new key
        return POST(request);
      }

      throw new Error(`RemoveBG API error: ${response.status}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  } catch (error) {
    console.error('Error in remove-bg API:', error);
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    );
  }
} 