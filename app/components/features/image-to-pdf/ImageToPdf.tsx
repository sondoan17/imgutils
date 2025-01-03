"use client";
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { jsPDF } from 'jspdf';
import Image from 'next/image';

interface ImageFile extends File {
  preview?: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [pageSize, setPageSize] = useState<string>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Create preview URLs after component mounts
  useEffect(() => {
    // Create preview URLs
    const newImages = images.map(file => ({
      ...file,
      preview: file.preview || URL.createObjectURL(file)
    }));
    setImages(newImages);
    
    // Cleanup function
    return () => {
      newImages.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [images]); // Include images in dependencies

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic']
    },
    maxSize: 10485760 // 10MB
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setConverting(true);
    try {
      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'p' : 'l',
        unit: 'mm',
        format: pageSize
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        
        const img = await createImageBitmap(images[i]);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.height / img.width;
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth * imgRatio;
        
        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = pdfHeight / imgRatio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      }

      pdf.save('converted-images.pdf');
    } catch (error) {
      console.error('Error converting to PDF:', error);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className="border-3 border-dashed border-purple-200 rounded-2xl p-16 text-center cursor-pointer hover:border-purple-400 transition-all duration-300 bg-gradient-to-b from-purple-50 to-white"
      >
        <input {...getInputProps()} />
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="text-gray-600">
            {isDragActive ? (
              <p className="text-xl font-medium text-purple-600">Drop your images here...</p>
            ) : (
              <>
                <p className="text-xl font-medium mb-2">Drag & drop your images here</p>
                <p className="text-gray-500">
                  or click to browse your files
                </p>
              </>
            )}
          </div>
          <p className="text-sm text-gray-400">
            Supports JPG, PNG, WebP, and HEIC formats up to 10MB each
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image 
                  src={image.preview || ''} 
                  alt="preview"
                  width={100}
                  height={100}
                  className="object-contain"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
            <button
              onClick={handleConvert}
              disabled={converting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300"
            >
              {converting ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        </div>
      )}

      {converting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
              <p className="mt-2 text-gray-600">Converting images to PDF...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 