import { useState } from 'react';

interface TextCustomizerProps {
  onTextChange: (text: string) => void;
  onPositionChange: (x: number, y: number) => void;
}

export default function TextCustomizer({ onTextChange, onPositionChange }: TextCustomizerProps) {
  const [text, setText] = useState('');
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTextChange(e.target.value);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    onPositionChange(newPosition.x, newPosition.y);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Background Text</label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter text..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">X Position (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={position.x}
            onChange={(e) => handlePositionChange('x', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Y Position (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={position.y}
            onChange={(e) => handlePositionChange('y', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
