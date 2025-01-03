import Header from '../components/shared/layout/Header';
import HeicConverter from '../components/features/image-conversion/HeicConverter';

export default function ImageConversion() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeFeature="image-conversion" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
            HEIC to JPEG/PNG Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert your HEIC images to JPEG or PNG format instantly. Free and easy to use.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <HeicConverter />
          <div className="mt-12 prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Understanding HEIC Files</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700">What is HEIC?</h3>
                <p className="text-gray-600">
                  HEIC (High Efficiency Image Container) is Apple&apos;s implementation of the HEIF standard. 
                  It offers superior compression compared to JPEG while maintaining higher image quality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Why Convert HEIC?</h3>
                <p className="text-gray-600">
                  While HEIC offers excellent compression, it&apos;s not universally supported. Converting to 
                  more common formats ensures compatibility across different devices and platforms.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mt-8 mb-4">Choosing the Right Format</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">JPEG</h4>
                <p className="text-gray-600 text-sm">
                  Best for photographs and complex images. Offers good compression while maintaining 
                  acceptable quality. Ideal for web use and sharing.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">PNG</h4>
                <p className="text-gray-600 text-sm">
                  Perfect for images requiring transparency. Provides lossless compression with no 
                  quality loss. Ideal for graphics and screenshots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 