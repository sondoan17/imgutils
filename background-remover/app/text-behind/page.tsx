

import Header from '../components/shared/layout/Header';
import TextBehind from '../components/features/text-behind/TextBehind';
import SEOWrapper from '../components/shared/SEOWrapper';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text Behind Effect - Create Unique Text Depth Effects',
  description: 'Create stunning text-behind-object effects with AI. Perfect for social media, marketing materials, and creative designs. Try our text depth effect tool now.',
  openGraph: {
    title: 'Text Behind Effect - Create Unique Text Depth Effects',
    description: 'Create stunning text-behind-object effects with AI. Perfect for social media, marketing materials, and creative designs.',
    images: ['/text-behind-preview.jpg'],
  }
}

export default function TextBehindPage() {
  return (
    <SEOWrapper
      title="Text Behind Effect - Create Unique Text Depth Effects"
      description="Create stunning text-behind-object effects with AI. Perfect for social media, marketing materials, and creative designs. Try our text depth effect tool now."
      keywords={[
        'text behind effect',
        'depth text effect',
        'AI text effects',
        'creative text design',
        'image text overlay'
      ]}
    >
      <div className="min-h-screen bg-gray-50">
        <Header activeFeature="text-behind" />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
              Text Behind Effect
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create unique text effects by placing text behind your subjects. Perfect for social media and creative designs.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <TextBehind />
          </div>
        </main>
      </div>
    </SEOWrapper>
  );
}
