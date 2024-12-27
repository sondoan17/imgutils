'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Image from 'next/image';

const convertBase64ToUrl = (base64String: string) => {
  return `data:image/png;base64,${base64String}`;
};

const ImageUploader = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
  const [generatedBackground, setGeneratedBackground] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 400, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ 
    width: 400, 
    height: 400, 
    x: 0, 
    y: 0,
    position: { x: 0, y: 0 } 
  });
  const [isSelected, setIsSelected] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const isProcessedImage = (e.target as HTMLElement).closest('.processed-image-container');
      if (!isProcessedImage) {
        setIsSelected(false);
        setIsResizing(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setOriginalImage(URL.createObjectURL(file));
    handleRemoveBackground(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    maxSize: 5242880 // 5MB
  });

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

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'removed-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      const blob = await fetch(data.imageUrl).then(r => r.blob());
      const file = new File([blob], 'generated-image.png', { type: 'image/png' });
      
      setOriginalImage(URL.createObjectURL(file));
      handleRemoveBackground(file);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBackground = async () => {
    if (!backgroundPrompt) return;
    
    setIsGeneratingBackground(true);
    try {
      const response = await axios.post('/api/generate-background', {
        prompt: backgroundPrompt
      });
      
      const imageUrl = convertBase64ToUrl(response.data.imageUrl.image);
      setGeneratedBackground(imageUrl);
    } catch (error) {
      console.error('Error generating background:', error);
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeStart = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
      position: { ...position }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const aspectRatio = resizeStart.width / resizeStart.height;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      switch (activeHandle) {
        case 'bottom-right':
        case 'top-right':
          newWidth = Math.max(100, resizeStart.width + deltaX * 2);
          newHeight = newWidth / aspectRatio;
          if (activeHandle === 'top-right') {
            newY = resizeStart.position.y + (resizeStart.height - newHeight);
          }
          break;

        case 'bottom-left':
        case 'top-left':
          newWidth = Math.max(100, resizeStart.width - deltaX * 2);
          newHeight = newWidth / aspectRatio;
          newX = resizeStart.position.x + (resizeStart.width - newWidth);
          if (activeHandle === 'top-left') {
            newY = resizeStart.position.y + (resizeStart.height - newHeight);
          }
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isGenerating || !prompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Or upload your own image:
        </div>
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select one</p>
        )}
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {originalImage && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Original Image</h3>
            <Image 
              src={originalImage}
              alt="Original"
              width={500}
              height={300}
              className="max-w-full rounded"
            />
          </div>
        )}
        {processedImage && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
            <Image 
              src={processedImage}
              alt="Processed"
              width={500}
              height={300}
              className="max-w-full rounded"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download PNG
              </button>
            </div>
          </div>
        )}
        {processedImage && (
          <div className="border rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Change Background</h3>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={backgroundPrompt}
                onChange={(e) => setBackgroundPrompt(e.target.value)}
                placeholder="Describe the background you want..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGenerateBackground}
                disabled={isGeneratingBackground || !backgroundPrompt.trim()}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  isGeneratingBackground || !backgroundPrompt.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isGeneratingBackground ? 'Generating...' : 'Generate Background'}
              </button>
            </div>
            {generatedBackground && (
              <div 
                className="relative w-[800px] h-[800px] overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <Image
                  src={generatedBackground}
                  alt="Generated background"
                  width={800}
                  height={800}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {processedImage && (
                  <div
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px)`,
                      cursor: isDragging ? 'grabbing' : 'grab',
                      position: 'absolute',
                      zIndex: 10,
                      width: size.width,
                      height: size.height,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e);
                      setIsSelected(true);
                    }}
                    className={`processed-image-container relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <Image
                      src={processedImage}
                      alt="Processed image"
                      width={size.width}
                      height={size.height}
                      className="w-full h-full object-contain select-none"
                      draggable={false}
                    />
                    
                    {isSelected && (
                      <div className="absolute inset-0">
                        <div 
                          className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500 cursor-ne-resize"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsResizing(true);
                            setActiveHandle('top-right');
                            setResizeStart({
                              width: size.width,
                              height: size.height,
                              x: e.clientX,
                              y: e.clientY,
                              position: { ...position }
                            });
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            setIsResizing(false);
                            setActiveHandle(null);
                          }}
                        />
                        <div 
                          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500 cursor-nw-resize"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsResizing(true);
                            setActiveHandle('top-left');
                            setResizeStart({
                              width: size.width,
                              height: size.height,
                              x: e.clientX,
                              y: e.clientY,
                              position: { ...position }
                            });
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            setIsResizing(false);
                            setActiveHandle(null);
                          }}
                        />
                        <div 
                          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500 cursor-se-resize"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsResizing(true);
                            setActiveHandle('bottom-right');
                            setResizeStart({
                              width: size.width,
                              height: size.height,
                              x: e.clientX,
                              y: e.clientY,
                              position: { ...position }
                            });
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            setIsResizing(false);
                            setActiveHandle(null);
                          }}
                        />
                        <div 
                          className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 cursor-sw-resize"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsResizing(true);
                            setActiveHandle('bottom-left');
                            setResizeStart({
                              width: size.width,
                              height: size.height,
                              x: e.clientX,
                              y: e.clientY,
                              position: { ...position }
                            });
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            setIsResizing(false);
                            setActiveHandle(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Processing image...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
