'use client';

interface HeaderProps {
  activeFeature?: string;
  onFeatureChange?: (feature: string) => void;
}

export default function Header({ activeFeature = 'remove-bg', onFeatureChange }: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-purple-600">
              ImageAI
            </span>
          </div>
          <nav className="hidden sm:flex sm:space-x-8">
            <button
              onClick={() => onFeatureChange?.('remove-bg')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeFeature === 'remove-bg'
                  ? 'border-purple-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Remove Background
            </button>
            <button
              onClick={() => onFeatureChange?.('text-behind')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeFeature === 'text-behind'
                  ? 'border-purple-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Text Behind Image
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
