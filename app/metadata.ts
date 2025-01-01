import { Metadata } from 'next/types';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://imgutils.vercel.app'),
  title: 'AI Image Processing Tools',
  description: 'Transform your images with powerful AI tools. Remove backgrounds, create text-behind effects, and more.',
  keywords: 'AI image processing, background removal, text effects, image editing',
  openGraph: {
    title: 'AI Image Processing Tools',
    description: 'Professional AI-powered image editing tools',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Image Processing Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Processing Tools',
    description: 'Professional AI-powered image editing tools',
    images: ['/og-image.jpg'],
  }
};
