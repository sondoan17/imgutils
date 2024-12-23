'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import TextOverlay from './TextOverlay';
import LayeredImageText from './LayeredImageText';

export default function TextBehind() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textOverlay, setTextOverlay] = useState({
    text: '',
    position: { x: 50, y: 50 },
    style: {
      fontSize: 120,
      color: '#FFD700',
      opacity: 0.8
    }
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
    setTextOverlay({ text, position, style });
  };

  const handleStyleChange = (newStyle: { fontSize: number; color: string; opacity: number }) => {
    setTextOverlay(prev => ({ ...prev, style: newStyle }));
  };

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setTextOverlay(prev => ({ ...prev, position: newPosition }));
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

      {originalImage && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Original Image</h3>
              <img src={originalImage} alt="Original" className="w-full h-auto rounded" />
            </div>
            {processedImage && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <LayeredImageText
                  originalImage={originalImage}
                  processedImage={processedImage}
                  text={textOverlay.text}
                  position={textOverlay.position}
                  style={textOverlay.style}
                  onStyleChange={handleStyleChange}
                  onPositionChange={handlePositionChange}
                />
              </div>
            )}
          </div>
          <TextOverlay onApply={handleTextOverlay} />
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
