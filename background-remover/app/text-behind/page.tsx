'use client';

import Header from '../components/shared/layout/Header';
import TextBehind from '../components/features/text-behind/TextBehind';

export default function TextBehindPage() {
  return (
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
  );
}
