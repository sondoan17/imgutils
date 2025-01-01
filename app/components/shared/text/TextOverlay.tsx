'use client';

import { useState, useEffect } from 'react';
import { TextStyle, defaultTextStyle } from '@/app/types/text';
import { 
  Roboto_Mono,
  Playfair_Display,
  Oswald,
  Dancing_Script,
  Pacifico,
  Permanent_Marker,
  Abril_Fatface,
  Bebas_Neue,
  Press_Start_2P,
  Sacramento,
  Montserrat,
  Lato,
  Open_Sans,
  Poppins,
  Raleway,
  Inter,
  Quicksand,
  Lobster,
  Comfortaa,
  Righteous,
  Satisfy,
  Caveat,
  Josefin_Sans,
  Shadows_Into_Light,
  Indie_Flower
} from 'next/font/google';

// Load fonts
const robotoMono = Roboto_Mono({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const oswald = Oswald({ subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });
const pacifico = Pacifico({ weight: '400', subsets: ['latin'] });
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'] });
const abrilFatface = Abril_Fatface({ weight: '400', subsets: ['latin'] });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] });
const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'] });
const sacramento = Sacramento({ weight: '400', subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });
const openSans = Open_Sans({ subsets: ['latin'] });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });
const quicksand = Quicksand({ subsets: ['latin'] });
const lobster = Lobster({ weight: '400', subsets: ['latin'] });
const comfortaa = Comfortaa({ subsets: ['latin'] });
const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const satisfy = Satisfy({ weight: '400', subsets: ['latin'] });
const caveat = Caveat({ subsets: ['latin'] });
const josefinSans = Josefin_Sans({ subsets: ['latin'] });
const shadowsIntoLight = Shadows_Into_Light({ weight: '400', subsets: ['latin'] });
const indieFlower = Indie_Flower({ weight: '400', subsets: ['latin'] });

const fontOptions = [
  // Modern Sans-Serif
  { name: 'Inter', font: inter, style: 'Modern & Professional' },
  { name: 'Poppins', font: poppins, style: 'Clean & Contemporary' },
  { name: 'Montserrat', font: montserrat, style: 'Modern Classic' },
  { name: 'Open Sans', font: openSans, style: 'Friendly & Approachable' },
  { name: 'Lato', font: lato, style: 'Balanced & Harmonious' },
  { name: 'Raleway', font: raleway, style: 'Elegant & Modern' },
  
  // Decorative & Display
  { name: 'Bebas Neue', font: bebasNeue, style: 'Bold Headlines' },
  { name: 'Righteous', font: righteous, style: 'Retro Futuristic' },
  { name: 'Abril Fatface', font: abrilFatface, style: 'Dramatic Display' },
  { name: 'Playfair Display', font: playfair, style: 'Editorial Style' },
  { name: 'Oswald', font: oswald, style: 'Strong & Condensed' },
  
  // Handwriting & Script
  { name: 'Dancing Script', font: dancingScript, style: 'Elegant Script' },
  { name: 'Pacifico', font: pacifico, style: 'Friendly Script' },
  { name: 'Satisfy', font: satisfy, style: 'Casual Script' },
  { name: 'Caveat', font: caveat, style: 'Natural Handwriting' },
  { name: 'Shadows Into Light', font: shadowsIntoLight, style: 'Playful Handwriting' },
  { name: 'Indie Flower', font: indieFlower, style: 'Fun & Casual' },
  
  // Unique & Special Purpose
  { name: 'Roboto Mono', font: robotoMono, style: 'Code & Technical' },
  { name: 'Permanent Marker', font: permanentMarker, style: 'Marker Style' },
  { name: 'Press Start 2P', font: pressStart, style: 'Retro Gaming' },
  { name: 'Lobster', font: lobster, style: 'Bold Script' },
  { name: 'Comfortaa', font: comfortaa, style: 'Modern Rounded' },
  { name: 'Quicksand', font: quicksand, style: 'Rounded & Friendly' },
  { name: 'Josefin Sans', font: josefinSans, style: 'Geometric & Stylish' }
];

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
    <div className={`space-y-4 p-4 border rounded-lg ${className} text-gray-700`}>
      <div>
        <label className="block text-sm font-medium mb-1">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-gray bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Font Family</span>
            <select
              value={style.fontFamily}
              onChange={(e) => handleStyleChange({ ...style, fontFamily: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              {fontOptions.map((option) => (
                <option
                  key={option.name}
                  value={option.name}
                  className={option.font.className}
                  style={{ fontFamily: option.name }}
                >
                  {option.name} - {option.style}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Weight</label>
          <select
            value={style.fontWeight}
            onChange={(e) => handleStyleChange({ fontWeight: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-gray-900"
          >
            {['normal', 'bold', 'lighter', 'bolder'].map(weight => (
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
