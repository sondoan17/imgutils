'use client';

import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import TextOverlay from '../../shared/text/TextOverlay';
import ResizableText from '../../shared/text/ResizableText';

interface TextLayer {
  id: string;
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    opacity: number;
  };
}

export default function TextBehind() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const handleRemoveBackground = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image_file', file);

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_REMOVEBG_API_KEY,
        },
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const originalUrl = URL.createObjectURL(file);
    setOriginalImage(originalUrl);
    handleRemoveBackground(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    maxSize: 5242880
  });

  const handleTextOverlay = (text: string, position: { x: number, y: number }, style: any) => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text,
      position,
      style
    };
    setTextLayers(prev => [...prev, newLayer]);
  };

  const handleDownload = async () => {
    if (!canvasRef.current || !originalImage || !processedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load images
    const original = await loadImage(originalImage);
    const processed = await loadImage(processedImage);

    // Set canvas size to match original image dimensions
    canvas.width = original.width;
    canvas.height = original.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw original image
    ctx.drawImage(original, 0, 0);

    // Draw text layers
    textLayers.forEach(layer => {
      // Configure text style
      ctx.font = `bold ${layer.style.fontSize}px Arial`;
      ctx.fillStyle = layer.style.color;
      ctx.globalAlpha = layer.style.opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Calculate actual pixel positions
      const x = (layer.position.x / 100) * canvas.width;
      const y = (layer.position.y / 100) * canvas.height;
      
      // Draw text
      ctx.fillText(layer.text, x, y);
    });

    // Reset global alpha before drawing processed image
    ctx.globalAlpha = 1;

    // Draw processed image on top
    ctx.drawImage(processed, 0, 0, canvas.width, canvas.height);

    // Create download link
    const link = document.createElement('a');
    link.download = 'text-behind-image.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select one</p>
        )}
      </div>

      {originalImage && processedImage && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Original Image</h3>
              <img src={originalImage} alt="Original" className="w-full h-auto rounded" />
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div 
                ref={containerRef}
                className="relative w-full overflow-hidden"
                style={{ 
                  aspectRatio: imageSize ? `${imageSize.width}/${imageSize.height}` : 'auto'
                }}
              >
                <img 
                  src={originalImage} 
                  alt="Base" 
                  className="w-full h-full object-contain"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
                  }}
                />
                <div className="absolute inset-0 overflow-hidden">
                  {textLayers.map(layer => (
                    <ResizableText
                      key={layer.id}
                      text={layer.text}
                      position={layer.position}
                      style={layer.style}
                      containerSize={{
                        width: containerRef.current?.clientWidth || 0,
                        height: containerRef.current?.clientHeight || 0
                      }}
                      onStyleChange={(newStyle) => {
                        setTextLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, style: newStyle } : l
                        ));
                      }}
                      onPositionChange={(newPosition) => {
                        setTextLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, position: newPosition } : l
                        ));
                      }}
                    />
                  ))}
                </div>
                <img
                  src={processedImage}
                  alt="Overlay"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>

          <TextOverlay onApply={handleTextOverlay} />

          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Download Image
          </button>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Processing image...</p>
        </div>
      )}
    </div>
  );
}
