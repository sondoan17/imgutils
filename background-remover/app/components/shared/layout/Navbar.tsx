'use client';

interface NavItem {
  id: string;
  label: string;
}

interface NavbarProps {
  activeFeature: string;
  onFeatureChange: (feature: string) => void;
}

export default function Navbar({ activeFeature, onFeatureChange }: NavbarProps) {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-purple-600">ImageAI</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onFeatureChange('remove-bg')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeFeature === 'remove-bg'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Remove Background
              </button>
              <button
                onClick={() => onFeatureChange('text-behind')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeFeature === 'text-behind'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Text Behind Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
