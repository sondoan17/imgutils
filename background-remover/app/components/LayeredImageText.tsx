'use client';

import { useState, useRef, useEffect } from 'react';
import ResizableText from './ResizableText';

interface LayeredImageTextProps {
  originalImage: string;
  processedImage: string;
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    opacity: number;
  };
  onStyleChange?: (newStyle: { fontSize: number; color: string; opacity: number }) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function LayeredImageText({
  originalImage,
  processedImage,
  text,
  position,
  style,
  onStyleChange,
  onPositionChange,
}: LayeredImageTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Load original image to get dimensions
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = originalImage;
  }, [originalImage]);

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        setContainerSize({
          width: rect?.width || 0,
          height: (rect?.width || 0) * (imageSize.height / imageSize.width),
        });
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [imageSize]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ 
        aspectRatio: `${imageSize.width}/${imageSize.height}`,
        maxHeight: '600px'
      }}
    >
      {/* Base layer with original image */}
      <div className="absolute inset-0">
        <img 
          src={originalImage} 
          alt="Original" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text layer */}
      <ResizableText
        text={text}
        position={position}
        style={style}
        containerSize={containerSize}
        onStyleChange={onStyleChange || (() => {})}
        onPositionChange={onPositionChange || (() => {})}
      />

      {/* Top layer with transparent background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={processedImage} 
          alt="Processed" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
