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
  const demoImages = useMemo(
    () => [
      "https://res.cloudinary.com/db2tvcbza/image/upload/v1735507403/cng1igldnopmgjjle3tp.png",
      "https://res.cloudinary.com/db2tvcbza/image/upload/v1735587306/rlyssrm9xio338omn0ix.png",
      "https://res.cloudinary.com/db2tvcbza/image/upload/v1735587629/gm053cw6qyecsszgonio.png",
      "https://res.cloudinary.com/db2tvcbza/image/upload/v1735588436/pummrglcechhswe8i7jh.png",
    ],
    []
  );

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
  const features = [
    {
      title: "Enhancement",
      icon: "✨",
      tools: [
        {
          name: "Background Remover",
          href: "/background-removal",
          isNew: false,
          soon: false,
        },
        {
          name: "Text Behind Effect",
          href: "/text-behind",
          isNew: true,
          soon: false,
        },
        {
          name: "Blur/Unblur Tool",
          href: "/blur-unblur",
          isNew: false,
          soon: true,
        },
      ],
    },
    {
      title: "Image Conversion",
      icon: "🔄",
      tools: [
        {
          name: "HEIC Converter",
          href: "/image-conversion",
          isNew: true,
          soon: false,
        },
        {
          name: "Image Format Converter",
          href: "/format-conversion",
          isNew: false,
          soon: true,
        },
        {
          name: "Image to PDF",
          href: "/image-to-pdf",
          isNew: true,
          soon: false,
        },
        {
          name: "SVG to PNG/JPG",
          href: "/svg-conversion",
          isNew: false,
          soon: true,
        },
      ],
    },
    {
      title: "Resizing Tools",
      icon: "📐",
      tools: [
        {
          name: "Grid Cropper",
          href: "/grid-cropper",
          isNew: false,
          soon: true,
        },
        {
          name: "Batch Resizer",
          href: "/batch-resize",
          isNew: false,
          soon: true,
        },
        {
          name: "Crop to Circle",
          href: "/circle-crop",
          isNew: false,
          soon: true,
        },
        {
          name: "Aspect Ratio Calculator",
          href: "/aspect-ratio",
          isNew: false,
          soon: true,
        },
      ],
    },
    {
      title: "Optimization",
      icon: "⚡",
      tools: [
        { name: "Image Compressor", href: "/compress", isNew: false, soon: true },
        { name: "Exif Extractor", href: "/exif", isNew: false, soon: true },
        { name: "DPI Changer", href: "/dpi", isNew: false, soon: true },
      ],
    },
  ];
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
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-purple-50 to-white ${robotoMono.className}`}
    >
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
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
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Features
          </h2>
          <div className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((category) => (
              <div
                key={category.title}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xl font-bold text-gray-800">
                    {category.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        tool.soon
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-purple-50"
                      } transition-colors`}
                      onClick={
                        tool.soon ? (e) => e.preventDefault() : undefined
                      }
                    >
                      <span className="text-gray-700">{tool.name}</span>
                      {tool.isNew && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                          New
                        </span>
                      )}
                      {tool.soon && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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
