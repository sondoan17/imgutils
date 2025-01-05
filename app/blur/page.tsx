'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '../components/shared/layout/Header';
import { useDropzone } from 'react-dropzone';

export default function BlurUnblur() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState(5);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setOriginalImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10485760 // 10MB
  });

  useEffect(() => {
    if (originalImage) {
      const img = new window.Image();
      img.src = originalImage;
      img.onload = () => {
        setImageElement(img);
        if (canvasRef) {
          const ctx = canvasRef.getContext('2d');
          if (ctx) {
            canvasRef.width = img.width;
            canvasRef.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
      };
    }
  }, [originalImage, canvasRef]);

  const handleCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      setCanvasRef(canvas);
    }
  }, []);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return null;
    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const applyBlur = useCallback((x: number, y: number) => {
    if (!canvasRef || !imageElement) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    // Create a temporary canvas for the blurred version
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.width;
    tempCanvas.height = canvasRef.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw and blur the image on temporary canvas
    tempCtx.filter = `blur(${blurAmount}px)`;
    tempCtx.drawImage(imageElement, 0, 0);

    // Apply the blurred portion
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
  }, [canvasRef, imageElement, blurAmount, brushSize]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    if (point) {
      setLastPoint(point);
      applyBlur(point.x, point.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const point = getCanvasPoint(e);
    if (point) {
      applyBlur(point.x, point.y);
      setLastPoint(point);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const resetCanvas = useCallback(() => {
    if (!canvasRef || !imageElement) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    ctx.drawImage(imageElement, 0, 0);
  }, [canvasRef, imageElement]);

  const handleDownload = useCallback(() => {
    if (!canvasRef) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'blurred-image.png';
    
    // Convert canvas content to data URL
    link.href = canvasRef.toDataURL('image/png', 1.0);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [canvasRef]);

  useEffect(() => {
    resetCanvas();
  }, [blurAmount, resetCanvas]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeFeature="blur-unblur" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
            Blur Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paint over areas to apply blur effect. Perfect for hiding sensitive information or creating artistic effects.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {!originalImage ? (
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
                      <p className="text-gray-500">or click to browse your files</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Supported formats: JPEG, PNG, WebP (max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blur Amount
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brush Size
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetCanvas}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Download
                  </button>
                </div>
              </div>

              <div 
                className="relative w-full border rounded-lg overflow-hidden" 
                style={{ aspectRatio: imageElement ? imageElement.width / imageElement.height : '16/9' }}
              >
                <canvas
                  ref={handleCanvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="absolute inset-0 w-full h-full object-contain cursor-crosshair"
                />
              </div>
            </div>
          )}

          <div className="mt-12 prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              About Blur Tool
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  How It Works
                </h3>
                <p className="text-gray-600">
                  Our blur tool allows you to selectively blur parts of your image with precision control. 
                  Simply paint over the areas you want to blur using our intuitive brush tool.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Best Practices
                </h3>
                <p className="text-gray-600">
                  Adjust the blur amount and brush size to achieve your desired effect. 
                  Use smaller brush sizes for precise control and larger sizes for broader areas.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mt-8 mb-4">
              Usage Tips
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">
                  Privacy Protection
                </h4>
                <p className="text-gray-600 text-sm">
                  Perfect for blurring sensitive information like personal details, addresses, or identification numbers.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">
                  Creative Effects
                </h4>
                <p className="text-gray-600 text-sm">
                  Create depth of field effects by selectively blurring backgrounds or foregrounds in your images.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">
                  Easy Control
                </h4>
                <p className="text-gray-600 text-sm">
                  Adjust blur intensity and brush size in real-time. Use the reset button to start over if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 