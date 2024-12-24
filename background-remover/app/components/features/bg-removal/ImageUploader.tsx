'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import TextCustomizer from '../../shared/text/TextCustomize';
import TextOverlay from '../../shared/text/TextOverlay';
import ImageTextPreview from './ImageTextPreview';

const ImageUploader = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundText, setBackgroundText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [textOverlay, setTextOverlay] = useState({
    text: '',
    position: { x: 50, y: 50 },
    style: {
      fontSize: 48,
      color: '#000000',
      opacity: 0.5
    }
  });

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
    setError(null);
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
      setError('Failed to remove background. Please try again.');
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

  const handleTextOverlay = (text: string, position: { x: number, y: number }, style: any) => {
    setTextOverlay({ text, position, style });
    setShowTextOverlay(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
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

      {processedImage && (
        <div className="mt-8">
          <TextCustomizer
            onTextChange={setBackgroundText}
            onPositionChange={(x, y) => setTextPosition({ x, y })}
          />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {originalImage && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Original Image</h3>
            <img src={originalImage} alt="Original" className="max-w-full rounded" />
          </div>
        )}
        {processedImage && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
            <ImageTextPreview
              imageUrl={processedImage}
              text={textOverlay.text}
              position={textOverlay.position}
              style={textOverlay.style}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowTextOverlay(!showTextOverlay)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {showTextOverlay ? 'Cancel Text' : 'Add Text'}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download PNG
              </button>
            </div>
            {showTextOverlay && (
              <div className="mt-4">
                <TextOverlay onApply={handleTextOverlay} />
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
