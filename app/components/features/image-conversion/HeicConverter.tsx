"use client";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Image from 'next/image';

export default function HeicConverter() {
  const [converting, setConverting] = useState(false);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'JPEG' | 'PNG'>('JPEG');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setConverting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', outputFormat);

      const response = await axios.post('/api/convert-heic', formData, {
        responseType: 'blob'
      });

      const url = URL.createObjectURL(response.data);
      setConvertedImage(url);
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      setConverting(false);
    }
  }, [outputFormat]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/heic': ['.heic', '.HEIC'],
      'image/heif': ['.heif', '.HEIF']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  return (
    <div className="space-y-6">
      {!convertedImage ? (
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
                <p className="text-xl font-medium text-purple-600">Drop your HEIC image here...</p>
              ) : (
                <>
                  <p className="text-xl font-medium mb-2">Drag & drop your HEIC image here</p>
                  <p className="text-gray-500">
                    or click to browse your files
                  </p>
                </>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Supports HEIC/HEIF formats up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Image 
            src={convertedImage} 
            alt="Converted"
            width={300}
            height={300}
            className="object-contain"
          />
          <div className="flex justify-center gap-4">
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as 'JPEG' | 'PNG')}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="JPEG">JPEG</option>
              <option value="PNG">PNG</option>
            </select>
            <a
              href={convertedImage}
              download={`converted.${outputFormat.toLowerCase()}`}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Download {outputFormat}
            </a>
          </div>
        </div>
      )}

      {converting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
              <p className="mt-2 text-gray-600">Converting image...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 