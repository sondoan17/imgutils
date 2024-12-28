'use client';

import { useState } from 'react';
import Navbar from './components/shared/layout/Navbar';
import ImageUploader from './components/features/bg-removal/ImageUploader';
import TextBehind from './components/features/text-behind/TextBehind';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState('remove-bg');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeFeature={activeFeature} 
        onFeatureChange={setActiveFeature} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          AI Image Processing
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Remove backgrounds and add text effects with AI
        </p>
        {activeFeature === 'remove-bg' ? (
          <ImageUploader />
        ) : (
          <TextBehind />
        )}
      </main>
      <footer className="mt-16 py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>Powered by sondoan17 • Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
