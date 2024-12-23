'use client';

import { useState } from 'react';

interface TextOverlayProps {
  onApply: (text: string, position: { x: number, y: number }, style: TextStyle) => void;
}

interface TextStyle {
  fontSize: number;
  color: string;
  opacity: number;
}

export default function TextOverlay({ onApply }: TextOverlayProps) {
  const [text, setText] = useState('');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [style, setStyle] = useState<TextStyle>({
    fontSize: 120,
    color: '#FFD700',
    opacity: 0.8
  });

  const handleApply = () => {
    onApply(text, position, style);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div>
        <label className="block text-sm font-medium mb-1">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <input
            type="range"
            min="48"
            max="400"
            value={style.fontSize}
            onChange={(e) => setStyle({ ...style, fontSize: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-sm">{style.fontSize}px</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="100"
            value={style.opacity * 100}
            onChange={(e) => setStyle({ ...style, opacity: Number(e.target.value) / 100 })}
            className="w-full"
          />
          <span className="text-sm">{Math.round(style.opacity * 100)}%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={style.color}
          onChange={(e) => setStyle({ ...style, color: e.target.value })}
          className="w-full h-10 rounded-md cursor-pointer"
        />
      </div>

      <button
        onClick={handleApply}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Apply Text
      </button>
    </div>
  );
}
