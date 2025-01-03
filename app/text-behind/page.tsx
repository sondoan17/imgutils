import Header from "../components/shared/layout/Header";
import TextBehind from "../components/features/text-behind/TextBehind";
import SEOWrapper from "../components/shared/SEOWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Behind Effect - Create Unique Text Depth Effects",
  description:
    "Create stunning text-behind-object effects with AI. Perfect for social media, marketing materials, and creative designs. Try our text depth effect tool now.",
  openGraph: {
    title: "Text Behind Effect - Create Unique Text Depth Effects",
    description:
      "Create stunning text-behind-object effects with AI. Perfect for social media, marketing materials, and creative designs.",
    images: ["/text-behind-preview.jpg"],
  },
};

export default function TextBehindPage() {
  return (
    <SEOWrapper
      title="Text Behind Effect - Create Unique Text Depth Effects"
      description="Create stunning text-behind-object effects with AI. Perfect for social media, marketing materials, and creative designs. Try our text depth effect tool now."
      keywords={[
        "text behind effect",
        "depth text effect",
        "AI text effects",
        "creative text design",
        "image text overlay",
      ]}
    >
      <div className="min-h-screen bg-gray-50">
        <Header activeFeature="text-behind" />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
              Text Behind Effect
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create unique text effects by placing text behind your subjects.
              Perfect for social media and creative designs.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <TextBehind />
            <div className="mt-12 prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                About Text Behind Effect
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">
                    How It Works
                  </h3>
                  <p className="text-gray-600">
                    Our AI technology automatically detects subjects in your
                    image and places text behind them, creating a natural depth
                    effect. This creates an illusion of text weaving through
                    your image.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">
                    Best Practices
                  </h3>
                  <p className="text-gray-600">
                    Use images with clear subjects and contrasting backgrounds.
                    The effect works best with well-defined objects, people, or
                    products in the foreground.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mt-8 mb-4">
                Design Tips
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">
                    Text Selection
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Choose bold, readable fonts that contrast well with your
                    image. Consider text size and spacing for maximum impact.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Color Choices</h4>
                  <p className="text-gray-600 text-sm">
                    Select text colors that complement your image while
                    maintaining readability. Consider using colors from your
                    image palette.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Composition</h4>
                  <p className="text-gray-600 text-sm">
                    Arrange text to create visual flow around your subject. Use
                    the depth effect to enhance your image&apos;s focal points.
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
