'use client';

import { siteConfig } from '@/app/metadata.config';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function CanonicalUrl() {
  const pathname = usePathname();
  const canonicalUrl = `${siteConfig.url}${pathname}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
} 