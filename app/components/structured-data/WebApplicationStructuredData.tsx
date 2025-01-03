export default function WebApplicationStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Image Tools Online Free',
    applicationCategory: 'ImageEditing',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'AI-powered background removal',
      'Text behind effect generator',
      'Custom text styling',
      'AI text suggestions',
      'High-quality image processing'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 