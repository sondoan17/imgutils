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
          <div className="mt-12 prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">About Background Removal</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700">How It Works</h3>
                <p className="text-gray-600">
                  Our technology precisely identifies and removes image backgrounds in seconds. 
                  Using advanced machine learning, it can handle complex images including hair, 
                  fur, and transparent objects.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Best Practices</h3>
                <p className="text-gray-600">
                  For best results, use images with clear subjects and good lighting. The tool 
                  works with various image types including products, portraits, and objects.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mt-8 mb-4">Output Options</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">PNG</h4>
                <p className="text-gray-600 text-sm">
                  Best for preserving transparency. Ideal for professional use and further editing.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">JPEG</h4>
                <p className="text-gray-600 text-sm">
                  Great for web use and smaller file sizes. Best when using with new backgrounds.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">WebP</h4>
                <p className="text-gray-600 text-sm">
                  Modern format offering excellent compression while maintaining quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
