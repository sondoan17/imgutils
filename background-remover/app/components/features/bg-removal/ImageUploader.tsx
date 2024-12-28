"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Image from "next/image";

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
  const [previewDimensions, setPreviewDimensions] = useState({
    width: 800,
    height: 800,
  });
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setOriginalImage(URL.createObjectURL(file));
    handleRemoveBackground(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    maxSize: 5242880, // 5MB
  });

  const handleRemoveBackground = async (file: File) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image_file", file);

    try {
      const response = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        data: formData,
        responseType: "arraybuffer",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_REMOVEBG_API_KEY,
        },
      });

      const blob = new Blob([response.data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDownloadWithBackground = async () => {
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

    // Calculate scale factors based on actual image dimensions
    const scaleX = bgImage.naturalWidth / containerRect.width;
    const scaleY = bgImage.naturalHeight / containerRect.height;

    // Calculate scaled position and size
    const scaledX = (position.x / containerRect.width) * bgImage.naturalWidth;
    const scaledY = (position.y / containerRect.height) * bgImage.naturalHeight;
    const scaledWidth = (size.width / containerRect.width) * bgImage.naturalWidth;
    const scaledHeight = (size.height / containerRect.height) * bgImage.naturalHeight;

    // Draw processed image
    const processedImg = await loadImage(processedImage);
    ctx.drawImage(
      processedImg,
      scaledX,
      scaledY,
      scaledWidth,
      scaledHeight
    );

    // Create download link
    const link = document.createElement('a');
    link.download = 'image-with-background.png';
    link.href = canvas.toDataURL('image/png', 1.0);
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {!processedImage ? (
        // Upload Section
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 transition-colors bg-gray-50"
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="text-gray-500">
              {isDragActive ? (
                <p className="text-lg">Drop your image here...</p>
              ) : (
                <>
                  <p className="text-lg mb-2">Drag & drop an image here</p>
                  <p className="text-sm text-gray-400">
                    or click to select one
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400">
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
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Download PNG
              </button>
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
                    maxWidth: '800px',
                    aspectRatio: imageSize ? `${imageSize.width}/${imageSize.height}` : '1/1',
                    minWidth: '600px'
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
                <button
                  onClick={handleDownloadWithBackground}
                  className="w-full max-w-[800px] mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download with Background
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-700">Processing image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
