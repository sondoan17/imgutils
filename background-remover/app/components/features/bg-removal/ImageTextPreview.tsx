interface ImageTextPreviewProps {
  imageUrl: string;
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    opacity: number;
  };
}

export default function ImageTextPreview({ imageUrl, text, position, style }: ImageTextPreviewProps) {
  return (
    <div className="relative w-full aspect-auto">
      {/* Background Container */}
      <div className="absolute inset-0 bg-white">
        {/* Text Layer */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            fontSize: `${style.fontSize}px`,
            color: style.color,
            opacity: style.opacity,
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          {text}
        </div>
      </div>

      {/* Image Layer with Background Removed */}
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="relative w-full h-auto"
        style={{ 
          mixBlendMode: 'multiply',
          filter: 'contrast(1.1)',
          WebkitFilter: 'contrast(1.1)',
        }}
      />
    </div>
  );
}
