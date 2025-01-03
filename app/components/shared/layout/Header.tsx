'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface HeaderProps {
  activeFeature?: 'remove-bg' | 'image-conversion' | 'text-behind' | 'image-to-pdf';
}

export default function Header({ activeFeature }: HeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const features = [
    
    {
      title: "Enhancement",
      tools: [
        { name: 'Remove Background', href: '/background-removal', id: 'remove-bg' },
        { name: 'Text Behind Effect', href: '/text-behind', id: 'text-behind' },
        { name: 'Blur/Unblur Tool', href: '/blur-unblur', soon: true },
      ]
    },
    {
      title: "Image Conversion",
      tools: [
        { name: 'HEIC Converter', href: '/image-conversion', id: 'image-conversion' },
        { name: 'Image Format Converter', href: '/format-conversion', soon: true },
        { name: 'Image to PDF', href: '/image-to-pdf', id: 'image-to-pdf' },
        { name: 'SVG to PNG/JPG', href: '/svg-conversion', soon: true },
      ]
    },
    {
      title: "Resizing Tools",
      tools: [
        { name: 'Grid Cropper', href: '/grid-cropper', soon: true },
        { name: 'Batch Resizer', href: '/batch-resize', soon: true },
        { name: 'Crop to Circle', href: '/circle-crop', soon: true },
        { name: 'Aspect Ratio Calculator', href: '/aspect-ratio', soon: true },
      ]
    },
    {
      title: "Optimization",
      tools: [
        { name: 'Image Compressor', href: '/compress', soon: true },
        { name: 'Exif Extractor', href: '/exif', soon: true },
        { name: 'DPI Changer', href: '/dpi', soon: true },
      ]
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-bold text-purple-600">
            ImageTools
          </a>

          {/* Right side navigation */}
          <div className="flex items-center">
            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <div 
                ref={menuRef}
                className="relative"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Features
                  <svg
                    className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div 
                    className="absolute top-full pt-2 right-0 w-[960px] z-50"
                    onMouseEnter={() => setIsMenuOpen(true)}
                  >
                    <div className="bg-white rounded-xl shadow-lg py-2">
                      <div className="grid grid-cols-4 gap-4 p-4">
                        {features.map((category) => (
                          <div key={category.title} className="space-y-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {category.title}
                            </div>
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.name}
                                href={tool.href}
                                className={`block px-3 py-2 text-sm rounded-lg ${
                                  activeFeature === tool.id
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                } ${tool.soon ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={tool.soon ? (e) => e.preventDefault() : undefined}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{tool.name}</span>
                                  {tool.soon && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                      Soon
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4">
            {features.map((category) => (
              <div key={category.title} className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                  {category.title}
                </div>
                <div className="space-y-1">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className={`block px-4 py-2 text-sm ${
                        activeFeature === tool.id
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-700'
                      } ${tool.soon ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => {
                        if (tool.soon) {
                          e.preventDefault();
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{tool.name}</span>
                        {tool.soon && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
