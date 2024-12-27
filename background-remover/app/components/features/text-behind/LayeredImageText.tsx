'use client';

import { useState, useRef, useEffect } from 'react';
import ResizableText from '../../shared/text/ResizableText';
import Image from 'next/image';
import { TextStyle } from '@/app/types/text';

interface LayeredImageTextProps {
  originalImage: string;
  processedImage: string;
  text: string;
  position: { x: number; y: number };
  style: TextStyle;
  onStyleChange?: (newStyle: TextStyle) => void;
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
    const img = document.createElement('img');
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = originalImage;
  }, [originalImage]);

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const aspectRatio = imageSize.height / imageSize.width;
          const height = rect.width * aspectRatio;
          setContainerSize({
            width: rect.width,
            height: height,
          });
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [imageSize]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden"
      style={{ 
        aspectRatio: `${imageSize.width}/${imageSize.height}`,
        maxHeight: '600px'
      }}
    >
      {/* Base layer with original image */}
      <div className="absolute inset-0">
        <Image 
          src={originalImage}
          alt="Original"
          fill
          className="object-contain"
        />
      </div>

      {/* Text layer with overflow control */}
      <div className="absolute inset-0 overflow-hidden">
        <ResizableText
          text={text}
          position={position}
          style={style}
          containerSize={containerSize}
          onStyleChange={onStyleChange || (() => {})}
          onPositionChange={onPositionChange || (() => {})}
        />
      </div>

      {/* Top layer with transparent background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image 
          src={processedImage}
          alt="Processed"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
