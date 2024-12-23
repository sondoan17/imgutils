'use client';

import { useState, useRef, useEffect } from 'react';

interface ResizableTextProps {
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    opacity: number;
  };
  containerSize: { width: number; height: number };
  onStyleChange: (newStyle: { fontSize: number; color: string; opacity: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function ResizableText({
  text,
  position,
  style,
  containerSize,
  onStyleChange,
  onPositionChange,
}: ResizableTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(style.fontSize);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaY = (e.clientY - startPos.y) * 0.5;
        const newSize = Math.max(20, Math.min(startSize + deltaY, containerSize.height / 2));
        onStyleChange({ ...style, fontSize: newSize });
      } else if (isDragging) {
        const containerRect = textRef.current?.parentElement?.getBoundingClientRect();
        if (!containerRect) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const percentX = (deltaX / containerRect.width) * 100;
        const percentY = (deltaY / containerRect.height) * 100;

        const newX = Math.min(Math.max(0, position.x + percentX), 100);
        const newY = Math.min(Math.max(0, position.y + percentY), 100);

        onPositionChange({ x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, startPos, startSize, dragStart, style, position, containerSize, onStyleChange, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize(style.fontSize);
  };

  return (
    <div
      ref={textRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        maxWidth: '90%',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          fontSize: `${style.fontSize}px`,
          color: style.color,
          opacity: style.opacity,
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      <div
        className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-75 cursor-se-resize"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}
