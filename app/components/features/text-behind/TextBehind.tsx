'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import TextOverlay from '../../shared/text/TextOverlay';
import ResizableText from '../../shared/text/ResizableText';
import Image from 'next/image';
import { TextStyle, defaultTextStyle } from '@/app/types/text';
import { removeBackground } from '@imgly/background-removal';

interface TextLayer {
  id: string;
  text: string;
  position: { x: number; y: number };
  style: TextStyle;
}

export default function TextBehind() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleRemoveBackground = async (file: File) => {
    setLoading(true);
    try {
      const blob = await removeBackground(file, {
        model: 'medium',
      });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Clear previous states
    setProcessedImage(null);
    setTextLayers([]);
    setImageSize(null);
    
    // Set new image
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

  const handleTextOverlay = (text: string, position: { x: number, y: number }, style: TextStyle) => {
    if (selectedLayerId && textLayers.some(layer => layer.id === selectedLayerId)) {
      // Only update if selected layer still exists
      setTextLayers(prev => prev.map(layer => 
        layer.id === selectedLayerId 
          ? { ...layer, text, style }
          : layer
      ));
    } else {
      // Add new layer and select it
      const newLayer: TextLayer = {
        id: Date.now().toString(),
        text,
        position,
        style
      };
      setTextLayers(prev => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current || !originalImage || !processedImage || !imageSize) return;

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
      ctx.save();
      
      // Calculate the scale factor between preview container and actual image
      const containerWidth = containerRef.current?.clientWidth || 1;
      const scaleFactor = canvas.width / containerWidth;
      
      // Calculate positions
      const x = canvas.width * (layer.position.x / 100);
      const y = canvas.height * (layer.position.y / 100);
      
      // Configure text style
      const fontSize = layer.style.fontSize * scaleFactor;
      ctx.font = `${layer.style.fontWeight || 'normal'} ${fontSize}px ${layer.style.fontFamily || 'Arial'}`;
      ctx.fillStyle = layer.style.color;
      ctx.globalAlpha = layer.style.opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '0.1em';
      
      
      // Reset shadow and global alpha for each layer 
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.globalAlpha = layer.style.opacity;

      // Apply shadow if enabled (before any drawing operations)
      if (layer.style.shadow?.enabled) {
        ctx.shadowColor = layer.style.shadow.color;
        ctx.shadowBlur = (layer.style.shadow.blur || 0) * scaleFactor;
        ctx.shadowOffsetX = (layer.style.shadow.offsetX || 0) * scaleFactor;
        ctx.shadowOffsetY = (layer.style.shadow.offsetY || 0) * scaleFactor;
      }

      // Draw stroke if enabled
      if (layer.style.stroke?.enabled) {
        ctx.strokeStyle = layer.style.stroke.color;
        ctx.lineWidth = (layer.style.stroke.width || 1) * scaleFactor;
        ctx.strokeText(layer.text, x, y);
      }

      // Draw text fill
      ctx.fillStyle = layer.style.color;
      ctx.fillText(layer.text, x, y);
      
      ctx.restore();
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
      const img = document.createElement('img');
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleRemoveText = (id: string) => {
    setTextLayers(prev => prev.filter(layer => layer.id !== id));
  };

  const handleRemoveAllText = () => {
    setTextLayers([]);
    setSelectedLayerId(null);  // Clear selection when removing all text
  };

  const generateTextSuggestions = async () => {
    if (!originalImage) return;
    
    setLoadingSuggestions(true);
    try {
      // Convert blob URL to base64
      const base64Image = await blobUrlToBase64(originalImage);
      
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: base64Image
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('API Error:', data.error, data.details);
        throw new Error(data.error);
      }
      
      if (!data.suggestions) {
        throw new Error('No suggestions received from API');
      }
      
      const suggestions = data.suggestions
        .split('\n')
        .filter((text: string) => text.trim())
        .map((text: string) => text.replace(/^\d+\.\s*/, ''))
        .slice(0, 3);
        
      if (suggestions.length === 0) {
        throw new Error('No valid suggestions found');
      }
        
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setAiSuggestions(['Failed to generate suggestions']);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Helper function to convert blob URL to base64
  const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert to base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting blob to base64:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Check if click is outside of any text layer and text controls
      const isTextLayer = (e.target as HTMLElement).closest('.text-layer');
      const isTextControls = (e.target as HTMLElement).closest('.text-controls');
      
      if (!isTextLayer && !isTextControls) {
        setSelectedLayerId(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="max-w-8xl mx-auto">
      {!processedImage ? (
        <div
          {...getRootProps()}
          className="border-3 border-dashed border-purple-200 rounded-2xl p-16 text-center cursor-pointer hover:border-purple-400 transition-all duration-300 bg-gradient-to-b from-purple-50 to-white"
        >
          <input {...getInputProps()} />
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-gray-600">
              {isDragActive ? (
                <p className="text-xl font-medium text-purple-600">Drop your image here...</p>
              ) : (
                <>
                  <p className="text-xl font-medium mb-2">Drag & drop your image here</p>
                  <p className="text-gray-500">
                    or click to browse your files
                  </p>
                </>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Supported formats: JPEG, PNG (max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
              <div className="flex gap-2">
                {selectedLayerId && (
                  <button
                    onClick={() => setSelectedLayerId(null)}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Deselect Text
                  </button>
                )}
                {textLayers.length > 0 && (
                  <button
                    onClick={handleRemoveAllText}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove All Text
                  </button>
                )}
              </div>
            </div>
            <div 
              ref={containerRef}
              className="relative w-full overflow-hidden"
              style={{ 
                aspectRatio: imageSize ? `${imageSize.width}/${imageSize.height}` : 'auto',
                maxHeight: '800px'
              }}
            >
              <Image 
                src={originalImage!}
                alt="Base"
                fill
                className="object-contain"
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
                    isSelected={layer.id === selectedLayerId}
                    containerSize={{
                      width: containerRef.current?.clientWidth || 0,
                      height: containerRef.current?.clientHeight || 0
                    }}
                    onSelect={() => setSelectedLayerId(layer.id)}
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
                    onRemove={() => {
                      handleRemoveText(layer.id);
                      if (selectedLayerId === layer.id) {
                        setSelectedLayerId(null);
                      }
                    }}
                  />
                ))}
              </div>
              <Image
                src={processedImage}
                alt="Overlay"
                fill
                className="object-contain pointer-events-none"
              />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">AI Text Suggestions</h3>
              <button
                onClick={generateTextSuggestions}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                disabled={loadingSuggestions || !originalImage}
              >
                {loadingSuggestions ? 'Generating...' : 'Get Suggestions'}
              </button>
            </div>
            
            {aiSuggestions.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleTextOverlay(suggestion, { x: 50, y: 50 }, defaultTextStyle)}
                    className="text-left p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <TextOverlay 
            onApply={handleTextOverlay}
            initialText={selectedLayerId ? textLayers.find(l => l.id === selectedLayerId)?.text : ''}
            initialStyle={selectedLayerId ? textLayers.find(l => l.id === selectedLayerId)?.style : defaultTextStyle}
            className="text-controls"
          />

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-lg font-medium text-gray-700">Processing image...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
