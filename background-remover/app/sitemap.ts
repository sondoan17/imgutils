import { MetadataRoute } from 'next'
    
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imgutils.vercel.app'
  const currentDate = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD

  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/background-removal`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/text-behind`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }
  ]

  return routes
} 