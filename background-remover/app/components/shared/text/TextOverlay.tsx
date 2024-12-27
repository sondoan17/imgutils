'use client';

import { useState, useEffect } from 'react';
import { TextStyle, defaultTextStyle } from '@/app/types/text';

const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Courier New'
];

const FONT_WEIGHTS = ['normal', 'bold', 'lighter', 'bolder'];

interface TextOverlayProps {
  onApply: (text: string, position: { x: number, y: number }, style: TextStyle) => void;
  initialText?: string;
  initialStyle?: TextStyle;
  className?: string;
}

export default function TextOverlay({ onApply, initialText = '', initialStyle = defaultTextStyle, className = '' }: TextOverlayProps) {
  const [text, setText] = useState(initialText);
  const [position] = useState({ x: 50, y: 50 });
  const [style, setStyle] = useState<TextStyle>(initialStyle);

  useEffect(() => {
    setText(initialText);
    setStyle(initialStyle);
  }, [initialText, initialStyle]);

  const handleStyleChange = (updates: Partial<TextStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }));
  };

  const handleShadowChange = (updates: Partial<TextStyle['shadow']>) => {
    setStyle(prev => ({
      ...prev,
      shadow: { ...prev.shadow, ...updates }
    }));
  };

  const handleStrokeChange = (updates: Partial<TextStyle['stroke']>) => {
    setStyle(prev => ({
      ...prev,
      stroke: { ...prev.stroke, ...updates }
    }));
  };

  return (
    <div className={`space-y-4 p-4 border rounded-lg ${className}`}>
      <div>
        <label className="block text-sm font-medium mb-1">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Font Family</label>
          <select
            value={style.fontFamily}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-gray-900 focus:ring-blue-500"
          >
            {FONT_FAMILIES.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Weight</label>
          <select
            value={style.fontWeight}
            onChange={(e) => handleStyleChange({ fontWeight: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-gray-900"
          >
            {FONT_WEIGHTS.map(weight => (
              <option key={weight} value={weight}>{weight}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Size</label>
          <input
            type="range"
            min="12"
            max="200"
            value={style.fontSize}
            onChange={(e) => handleStyleChange({ fontSize: Number(e.target.value) })}
            className="w-full accent-blue-500"
          />
          <span className="text-sm">{style.fontSize}px</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={style.color}
            onChange={(e) => handleStyleChange({ color: e.target.value })}
            className="w-full h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={style.shadow.enabled}
            onChange={(e) => handleShadowChange({ enabled: e.target.checked })}
            className="mr-2 h-4 w-4 accent-blue-500"
          />
          <label className="text-sm font-medium">Enable Shadow</label>
        </div>
        
        {style.shadow.enabled && (
          <div className="grid grid-cols-2 gap-4 pl-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shadow Color</label>
              <input
                type="color"
                value={style.shadow.color}
                onChange={(e) => handleShadowChange({ color: e.target.value })}
                className="w-full h-8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Blur</label>
              <input
                type="range"
                min="0"
                max="20"
                value={style.shadow.blur}
                onChange={(e) => handleShadowChange({ blur: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offset X</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={style.shadow.offsetX}
                onChange={(e) => handleShadowChange({ offsetX: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offset Y</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={style.shadow.offsetY}
                onChange={(e) => handleShadowChange({ offsetY: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={style.stroke.enabled}
            onChange={(e) => handleStrokeChange({ enabled: e.target.checked })}
            className="mr-2 h-4 w-4 accent-blue-500"
          />
          <label className="text-sm font-medium">Enable Stroke</label>
        </div>
        
        {style.stroke.enabled && (
          <div className="grid grid-cols-2 gap-4 pl-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stroke Color</label>
              <input
                type="color"
                value={style.stroke.color}
                onChange={(e) => handleStrokeChange({ color: e.target.value })}
                className="w-full h-8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stroke Width</label>
              <input
                type="range"
                min="1"
                max="10"
                value={style.stroke.width}
                onChange={(e) => handleStrokeChange({ width: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onApply(text, position, style)}
        disabled={!text.trim()}
        className={`w-full px-4 py-2 text-white rounded transition-colors ${
          !text.trim() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {initialText ? 'Save Changes' : 'Add Text'}
      </button>
    </div>
  );
}
