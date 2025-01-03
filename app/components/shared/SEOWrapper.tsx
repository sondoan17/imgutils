"use client";
import Script from 'next/script';

interface SEOWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
}

export default function SEOWrapper({ children, title, description, keywords }: SEOWrapperProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title || "ImageUtils",
    "description": description,
    "applicationCategory": "Image Processing Tool",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Background Removal",
      "HEIC Conversion",
      "PDF Creation",
      "Text Effects"
    ],
    "keywords": keywords
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      {children}
    </>
  );
} 