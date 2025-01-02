"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./components/shared/layout/Header";
import Footer from "./components/shared/layout/Footer";
import { useState, useEffect, useMemo } from "react";
import { Roboto_Mono } from "next/font/google";
import { motion } from "framer-motion";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [openQuestions, setOpenQuestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Array of demo images
  const demoImages = useMemo(() => [
    "https://res.cloudinary.com/db2tvcbza/image/upload/v1735507403/cng1igldnopmgjjle3tp.png",
    "https://res.cloudinary.com/db2tvcbza/image/upload/v1735587306/rlyssrm9xio338omn0ix.png", 
    "https://res.cloudinary.com/db2tvcbza/image/upload/v1735587629/gm053cw6qyecsszgonio.png",
    "https://res.cloudinary.com/db2tvcbza/image/upload/v1735588436/pummrglcechhswe8i7jh.png",
  ], []);

  const layerVariants = {
    layer4: { rotate: 9, scale: 0.9, zIndex: 1 },
    layer3: { rotate: 6, scale: 0.95, zIndex: 2 },
    layer2: { rotate: 3, scale: 1, zIndex: 3 },
    layer1: { rotate: -3, scale: 1.05, zIndex: 4 },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % demoImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [demoImages.length]);

  const handleImageClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % demoImages.length);
  };

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqSections = [
    {
      title: "About ImageUtils",
      questions: [
        {
          id: "what-is",
          question: "What is ImageUtils?",
          answer:
            "ImageUtils is a powerful image processing platform that offers professional-grade tools for background removal and creative text effects. Our tools are designed to be easy to use while delivering high-quality results.",
        },
        {
          id: "how-to-use",
          question: "How to Use ImageUtils?",
          answer:
            "Simply upload your image, choose your desired effect (background removal or text behind), and let our app do the work. No sign-up required - just upload and start creating!",
        },
        {
          id: "is-free",
          question: "Is ImageUtils Free?",
          answer:
            "Yes! ImageUtils is completely free to use. We believe in making powerful image processing tools accessible to everyone. No hidden fees or subscription required.",
        },
      ],
    },
    {
      title: "Background Removal",
      questions: [
        {
          id: "accuracy",
          question: "How accurate is the background removal?",
          answer:
            "Our technology achieves 99% accuracy in detecting and removing backgrounds from images. It works especially well with portraits, product photos, and objects with clear edges.",
        },
        {
          id: "formats",
          question: "What image formats are supported?",
          answer:
            "We support all common image formats including JPG, PNG, and WEBP. The maximum file size is 5MB to ensure quick processing.",
        },
        {
          id: "custom-bg",
          question: "Can I add custom backgrounds?",
          answer:
            "Yes! After removing the background, you can either keep it transparent or generate custom backgrounds using our AI background generator with simple text prompts.",
        },
        {
          id: "processing-time",
          question: "How long does processing take?",
          answer:
            "Processing time may vary based on image size and complexity, but we optimize for speed without sacrificing quality.",
        },
      ],
    },
    {
      title: "Text Behind Effect",
      questions: [
        {
          id: "how-works",
          question: "How does the text behind effect work?",
          answer:
            "Our technology analyzes your image to create depth maps, allowing text to appear naturally behind subjects in your photo. You can adjust text position, size, and style for perfect placement.",
        },
        {
          id: "customize",
          question: "Can I customize the text style?",
          answer:
            "Yes! You can customize font size, color, opacity, and add effects like shadows or strokes. We also offer AI-powered text suggestions for creative inspiration.",
        },
        {
          id: "best-images",
          question: "What types of images work best?",
          answer:
            "The effect works best with images that have clear subjects and some depth. Portraits, product photos, and landscape images are ideal for creating stunning text-behind effects.",
        },
        {
          id: "save-edit",
          question: "Can I save and edit my designs?",
          answer:
            "You can download your finished designs in high quality. While we don't currently save projects, we're working on adding project saving and editing features soon.",
        },
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-purple-50 to-white ${robotoMono.className}`}
    >
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 tracking-tight mb-6">
              Transform Your <span className="text-purple-600">Images</span>{" "}
              with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Unlock{" "}
              <span className="text-purple-600 font-semibold">
                professional-grade
              </span>{" "}
              image processing tools powered by cutting-edge AI. Transform your
              photos with background removal and create captivating text
              effects, all completely{" "}
              <span className="text-purple-600 font-semibold">FREE</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/background-removal"
                className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                Try Background Removal
              </Link>
              <Link
                href="/text-behind"
                className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors text-lg font-medium"
              >
                Text Behind Effect
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm font-medium text-purple-600">
                No Sign Up Needed
              </p>
            </div>
          </div>

          {/* Stacked Images with Layer Transitions */}
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square group">
              {demoImages.map((image, index) => {
                const position = (index - currentImageIndex + 4) % 4;
                const layerName = `layer${
                  position + 1
                }` as keyof typeof layerVariants;
                const isTopLayer = position === 0;

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={layerVariants[layerName]}
                    animate={{
                      ...layerVariants[layerName],
                      scale:
                        isTopLayer && isHovered
                          ? 1.1
                          : layerVariants[layerName].scale,
                      rotate:
                        isTopLayer && isHovered
                          ? -6
                          : layerVariants[layerName].rotate,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 1,
                    }}
                    style={{
                      zIndex: layerVariants[layerName].zIndex,
                      cursor: isTopLayer ? "pointer" : "default",
                    }}
                    onClick={isTopLayer ? handleImageClick : undefined}
                    onHoverStart={() => isTopLayer && setIsHovered(true)}
                    onHoverEnd={() => isTopLayer && setIsHovered(false)}
                  >
                    <Image
                      src={image}
                      alt={`Image Processing Demo ${index + 1}`}
                      fill
                      className="object-cover rounded-2xl shadow-xl"
                      priority
                    />
                  </motion.div>
                );
              })}

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {demoImages.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: index === currentImageIndex ? 1.25 : 1,
                      backgroundColor:
                        index === currentImageIndex ? "#9333EA" : "#D1D5DB",
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Background Removal
            </h2>
            <p className="text-gray-600 mb-6">
              Remove backgrounds from your images instantly with our advanced
              technology. Perfect for product photos, portraits, and creative
              projects.
            </p>
            <Link
              href="/background-removal"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
            >
              Try it now
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Text Behind Effect
            </h2>
            <p className="text-gray-600 mb-6">
              Create unique depth effects by placing text behind your subjects.
              Ideal for social media posts, marketing materials, and creative
              designs.
            </p>
            <Link
              href="/text-behind"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
            >
              Try it now
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Frequently Asked Questions
          </h2>

          {faqSections.map((section) => (
            <div key={section.title} className="mb-12">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.questions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(item.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.question}
                      </h4>
                      <svg
                        className={`w-6 h-6 text-purple-600 transform transition-transform duration-200 ${
                          openQuestions[item.id] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`px-6 transition-all duration-200 ease-in-out ${
                        openQuestions[item.id]
                          ? "max-h-96 py-4 opacity-100"
                          : "max-h-0 py-0 opacity-0"
                      }`}
                    >
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
