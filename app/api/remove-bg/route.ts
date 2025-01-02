import { NextResponse } from 'next/server';
import ApiKeyManager from '@/app/utils/apiKeyManager';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let success = false;
    let lastError: any;

    while (!success) {
      const currentKey = ApiKeyManager.getCurrentKey();
      if (!currentKey) {
        throw new Error('All API keys have failed');
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
        } else {
          if (response.status === 402 || response.status === 401) {
            const nextKey = ApiKeyManager.rotateKey();
            if (!nextKey) break;
            continue;
          }
          throw new Error(`RemoveBG API error: ${response.status}`);
        }
      } catch (error) {
        lastError = error;
        const nextKey = ApiKeyManager.rotateKey();
        if (!nextKey) break;
      }
    }

    console.error('All API keys failed:', lastError);
    return NextResponse.json(
      { error: 'Failed to remove background - all API keys exhausted' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error in remove-bg API:', error);
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    );
  }
} 