'use client';

import Link from 'next/link';

interface HeaderProps {
  activeFeature?: string;
}

export default function Header({ activeFeature = 'remove-bg' }: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              ImageAI
            </Link>
          </div>
          <nav className="hidden sm:flex sm:space-x-8">
            <Link
              href="/background-removal"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeFeature === 'remove-bg'
                  ? 'border-purple-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Remove Background
            </Link>
            <Link
              href="/text-behind"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeFeature === 'text-behind'
                  ? 'border-purple-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Text Behind Image
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
