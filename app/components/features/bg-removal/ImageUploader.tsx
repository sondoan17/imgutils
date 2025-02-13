"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Image from "next/image";
import { removeBackground } from '@imgly/background-removal';
import { isMobileDevice } from '@/app/utils/deviceDetection';
import { ImageFormat } from '@/app/types/image';

const convertBase64ToUrl = (base64String: string) => {
  return `data:image/png;base64,${base64String}`;
};

const ImageUploader = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backgroundPrompt, setBackgroundPrompt] = useState("");
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
  const [generatedBackground, setGeneratedBackground] = useState<string | null>(
    null
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    width: 400,
    height: 400,
    x: 0,
    y: 0,
    position: { x: 0, y: 0 },
  });
  const [isSelected, setIsSelected] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [, setPreviewDimensions] = useState({
    width: 800,
    height: 800,
  });
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [processedFormat, setProcessedFormat] = useState<ImageFormat>('png');
  const [compositeFormat, setCompositeFormat] = useState<ImageFormat>('png');

  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    // Add resize listener for responsive updates
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const isProcessedImage = (e.target as HTMLElement).closest(
        ".processed-image-container"
      );
      if (!isProcessedImage) {
        setIsSelected(false);
        setIsResizing(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleRemoveBackground = useCallback(async (file: File) => {
    setLoading(true);
    try {
      // Read the file as Data URL for original image
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOriginalImage(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Process background removal
      let processedUrl;
      if (isMobile) {
        const formData = new FormData();
        formData.append('image_file', file);
        
        const response = await axios.post('/api/remove-bg', formData, {
          responseType: 'arraybuffer'
        });
        
        const blob = new Blob([response.data], { type: 'image/png' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setProcessedImage(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } else {
        const blob = await removeBackground(file, {
          model: 'medium',
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setProcessedImage(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  }, [isMobile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Clear previous states
    setOriginalImage(null);
    setProcessedImage(null);
    
    const file = acceptedFiles[0];
    if (file) {
      handleRemoveBackground(file);
    }
  }, [handleRemoveBackground]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    maxSize: 5242880, // 5MB
  });

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "removed-background.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadWithBackground = async (format: ImageFormat) => {
    if (!processedImage || !generatedBackground || !imageSize) return;

    const canvas = document.createElement('canvas');
    const bgImage = await loadImage(generatedBackground);
    canvas.width = bgImage.naturalWidth;
    canvas.height = bgImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Get container dimensions
    const containerElement = document.querySelector('.relative.overflow-hidden');
    if (!containerElement) return;
    const containerRect = containerElement.getBoundingClientRect();

    // Calculate scaled position and size
    const scaledX = (position.x / containerRect.width) * bgImage.naturalWidth;
    const scaledY = (position.y / containerRect.height) * bgImage.naturalHeight;
    const scaledWidth = (size.width / containerRect.width) * bgImage.naturalWidth;
    const scaledHeight = (size.height / containerRect.height) * bgImage.naturalHeight;

    // Draw processed image
    const processedImg = await loadImage(processedImage);
    ctx.drawImage(processedImg, scaledX, scaledY, scaledWidth, scaledHeight);

    // Configure format and quality
    const mimeType = `image/${format}`;
    const quality = format === 'png' ? 1 : 0.9;

    // Create download link
    const link = document.createElement('a');
    link.download = `image-with-background.${format}`;
    link.href = canvas.toDataURL(mimeType, quality);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleGenerateBackground = async () => {
    if (!backgroundPrompt) return;

    setIsGeneratingBackground(true);
    try {
      const response = await axios.post("/api/generate-background", {
        prompt: backgroundPrompt,
      });

      const imageUrl = convertBase64ToUrl(response.data.imageUrl.image);
      setGeneratedBackground(imageUrl);
    } catch (error) {
      console.error("Error generating background:", error);
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
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
      position: { ...position },
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const aspectRatio = resizeStart.width / resizeStart.height;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      // Maintain aspect ratio while resizing
      if (activeHandle?.includes('right')) {
        newWidth = Math.max(100, resizeStart.width + deltaX);
        newHeight = newWidth / aspectRatio;
      } else if (activeHandle?.includes('left')) {
        newWidth = Math.max(100, resizeStart.width - deltaX);
        newHeight = newWidth / aspectRatio;
        newX = resizeStart.position.x + (resizeStart.width - newWidth);
      }

      if (activeHandle?.includes('top')) {
        newY = resizeStart.position.y + (resizeStart.height - newHeight);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      setIsDragging(true);
      setIsSelected(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (processedImage) {
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const width = Math.min(800, img.naturalWidth);
        const height = width / aspectRatio;
        setPreviewDimensions({ width, height });
      };
      img.src = processedImage;
    }
  }, [processedImage]);

  useEffect(() => {
    if (generatedBackground) {
      const img = new window.Image();
      img.onload = () => {
        setPreviewDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = generatedBackground;
    }
  }, [generatedBackground]);

  const handleExport = async (format: ImageFormat) => {
    if (!processedImage) return;
    
    const canvas = document.createElement('canvas');
    const img = await loadImage(processedImage);
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the image
    ctx.drawImage(img, 0, 0);
    
    // Configure format and quality
    const mimeType = `image/${format}`;
    const quality = format === 'png' ? 1 : 0.9;
    
    // Convert to desired format
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `processed-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        // Image Processing Section
        <div className="space-y-8">
          {/* Image Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Original Image */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Original Image
              </h3>
              <div className="relative aspect-square">
                <Image
                  src={originalImage!}
                  alt="Original"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Processed Image */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Background Removed
              </h3>
              <div className="relative aspect-square">
                <Image
                  src={processedImage}
                  alt="Processed"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="space-y-4">
                {/* Processed Image Download */}
                <div className="flex justify-center gap-4">
                  <select
                    value={processedFormat}
                    onChange={(e) => setProcessedFormat(e.target.value as ImageFormat)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WebP</option>
                  </select>
                  <button
                    onClick={() => handleExport(processedFormat)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Download Processed {processedFormat.toUpperCase()}
                  </button>
                </div>

              
              </div>
            </div>
          </div>

          {/* Background Generation Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-700">
              Change Background
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={backgroundPrompt}
                onChange={(e) => setBackgroundPrompt(e.target.value)}
                placeholder="Describe the background you want..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={handleGenerateBackground}
                disabled={isGeneratingBackground || !backgroundPrompt.trim()}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isGeneratingBackground || !backgroundPrompt.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isGeneratingBackground ? "Generating..." : "Generate"}
              </button>
            </div>

            {/* Background Preview */}
            {generatedBackground && (
              <div className="space-y-4">
                <div
                  className="relative overflow-hidden mx-auto rounded-lg shadow-md"
                  style={{ 
                    width: '100%',
                    maxWidth: isMobile ? '100%' : '800px',
                    aspectRatio: imageSize ? `${imageSize.width}/${imageSize.height}` : '1/1',
                    minWidth: isMobile ? 'auto' : '600px'
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <Image
                    src={generatedBackground}
                    alt="Generated background"
                    fill
                    className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100"
                    priority
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
                    }}
                  />
                  {processedImage && (
                    <div
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        position: 'absolute',
                        zIndex: 10,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        willChange: 'transform',
                        touchAction: 'none',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMouseDown(e);
                        setIsSelected(true);
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className={`processed-image-container relative ${
                        isSelected ? 'ring-2 ring-purple-500' : ''
                      } transform-gpu`}
                    >
                      <Image
                        src={processedImage}
                        alt="Processed image"
                        fill
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                        priority
                        onLoad={(e) => {
                          // Set initial size based on image dimensions
                          const img = e.target as HTMLImageElement;
                          const maxDimension = 200; // Maximum initial dimension
                          const aspectRatio = img.naturalWidth / img.naturalHeight;
                          
                          let newWidth, newHeight;
                          if (aspectRatio > 1) {
                            newWidth = maxDimension;
                            newHeight = maxDimension / aspectRatio;
                          } else {
                            newHeight = maxDimension;
                            newWidth = maxDimension * aspectRatio;
                          }
                          
                          setSize({ width: newWidth, height: newHeight });
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0">
                          {/* Resize handles */}
                          <div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-sm cursor-ne-resize"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsResizing(true);
                              setActiveHandle("top-right");
                              setResizeStart({
                                width: size.width,
                                height: size.height,
                                x: e.clientX,
                                y: e.clientY,
                                position: { ...position },
                              });
                            }}
                          />
                          <div
                            className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-sm cursor-nw-resize"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsResizing(true);
                              setActiveHandle("top-left");
                              setResizeStart({
                                width: size.width,
                                height: size.height,
                                x: e.clientX,
                                y: e.clientY,
                                position: { ...position },
                              });
                            }}
                          />
                          <div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-sm cursor-se-resize"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsResizing(true);
                              setActiveHandle("bottom-right");
                              setResizeStart({
                                width: size.width,
                                height: size.height,
                                x: e.clientX,
                                y: e.clientY,
                                position: { ...position },
                              });
                            }}
                          />
                          <div
                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-sm cursor-sw-resize"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsResizing(true);
                              setActiveHandle("bottom-left");
                              setResizeStart({
                                width: size.width,
                                height: size.height,
                                x: e.clientX,
                                y: e.clientY,
                                position: { ...position },
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                    <select
                      value={compositeFormat}
                      onChange={(e) => setCompositeFormat(e.target.value as ImageFormat)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                    </select>
                    <button
                      onClick={() => handleDownloadWithBackground(compositeFormat)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Download With Background {compositeFormat.toUpperCase()}
                    </button>
                  </div>
              </div>
            )}
          </div>
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
};

export default ImageUploader;
