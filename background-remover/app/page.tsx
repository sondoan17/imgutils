'use client';

import { useState } from 'react';
import Navbar from './components/shared/layout/Navbar';
import ImageUploader from './components/features/bg-removal/ImageUploader';
import TextBehind from './components/features/text-behind/TextBehind';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState('remove-bg');

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        activeFeature={activeFeature} 
        onFeatureChange={setActiveFeature} 
      />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Image Processing Tool
        </h1>
        {activeFeature === 'remove-bg' ? (
          <ImageUploader />
        ) : (
          <TextBehind />
        )}
      </div>
    </div>
  );
}
