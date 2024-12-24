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
  const features: NavItem[] = [
    { id: 'remove-bg', label: 'Remove Background' },
    { id: 'text-behind', label: 'Text Behind Object' },
  ];

  return (
    <nav className="bg-background border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => onFeatureChange(feature.id)}
              className={`py-4 px-3 text-sm font-medium border-b-2 ${
                activeFeature === feature.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {feature.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
