import Header from '../components/shared/layout/Header';
import ImageToPdf from '../components/features/image-to-pdf/ImageToPdf';
import SEOWrapper from '../components/shared/SEOWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image to PDF Converter - Convert Images to PDF Files',
  description: 'Convert your images to PDF format instantly. Combine multiple images into a single PDF. Free and easy to use.',
  openGraph: {
    title: 'Image to PDF Converter - Convert Images to PDF Files',
    description: 'Convert your images to PDF format instantly. Combine multiple images into a single PDF.',
    images: ['/image-to-pdf-preview.jpg'],
  }
}

export default function ImageToPdfPage() {
  return (
    <SEOWrapper
      title="Image to PDF Converter - Convert Images to PDF Files"
      description="Convert your images to PDF format instantly. Combine multiple images into a single PDF. Free and easy to use."
      keywords={[
        'image to pdf',
        'convert images to pdf',
        'combine images pdf',
        'image converter',
        'pdf creator'
      ]}
    >
      <div className="min-h-screen bg-gray-50">
        <Header activeFeature="image-to-pdf" />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
              Image to PDF Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convert and combine your images into PDF format instantly. Free and easy to use.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ImageToPdf />
            <div className="mt-12 prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">About Image to PDF Conversion</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">How It Works</h3>
                  <p className="text-gray-600">
                    Our tool allows you to convert single or multiple images into PDF format. 
                    You can arrange images, adjust page sizes, and customize the output quality.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Supported Formats</h3>
                  <p className="text-gray-600">
                    Upload images in JPG, PNG, WebP, or HEIC format. Convert them to 
                    professional-quality PDF documents suitable for printing or sharing.
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-gray-800 mt-8 mb-4">Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Batch Processing</h4>
                  <p className="text-gray-600 text-sm">
                    Convert multiple images at once. Arrange and reorder pages before conversion.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Quality Control</h4>
                  <p className="text-gray-600 text-sm">
                    Adjust PDF quality and compression to balance file size and image clarity.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Page Settings</h4>
                  <p className="text-gray-600 text-sm">
                    Choose page orientation and size. Add margins and spacing as needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SEOWrapper>
  );
} 