'use client';

import Header from '../components/shared/layout/Header';
import ImageUploader from '../components/features/bg-removal/ImageUploader';

export default function BackgroundRemoval() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeFeature="remove-bg" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
            AI Background Remover
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Remove backgrounds from your images instantly with AI technology. Add custom backgrounds to create stunning visuals.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <ImageUploader />
        </div>
      </main>
    </div>
  );
}
