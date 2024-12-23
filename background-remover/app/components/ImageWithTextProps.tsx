interface ImageWithTextProps {
  imageUrl: string;
  text: string;
  textPosition: { x: number; y: number };
}

export default function ImageWithText({ imageUrl, text, textPosition }: ImageWithTextProps) {
  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute text-4xl font-bold text-gray-300"
        style={{
          left: `${textPosition.x}%`,
          top: `${textPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      >
        {text}
      </div>
      <img 
        src={imageUrl} 
        alt="Processed" 
        className="relative z-10 max-w-full h-auto rounded"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
