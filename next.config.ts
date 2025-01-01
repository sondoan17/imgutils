import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add WASM file support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Add rule for ONNX models
    config.module.rules.push({
      test: /\.onnx$/,
      type: "asset/resource",
    });

    return config;
  },
  // Disable image optimization for processed images
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default nextConfig;

