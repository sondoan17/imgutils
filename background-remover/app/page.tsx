'use client';

import Link from 'next/link';
import Header from './components/shared/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-6xl font-bold text-gray-800 tracking-tight">
            AI Image Processing Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your images with our powerful AI-powered tools
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/background-removal" 
            className="group bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Background Removal</h2>
            <p className="text-gray-600">
              Remove backgrounds from your images instantly with AI technology. Add custom backgrounds to create stunning visuals.
            </p>
            <span className="inline-block mt-4 text-purple-600 group-hover:translate-x-2 transition-transform">
              Try it now →
            </span>
          </Link>
          
          <Link href="/text-behind"
            className="group bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Text Behind Effect</h2>
            <p className="text-gray-600">
              Create unique text effects by placing text behind your subjects. Perfect for social media and creative designs.
            </p>
            <span className="inline-block mt-4 text-purple-600 group-hover:translate-x-2 transition-transform">
              Try it now →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
