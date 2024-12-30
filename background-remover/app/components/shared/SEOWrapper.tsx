import CanonicalUrl from './CanonicalUrl';
import WebApplicationStructuredData from '../structured-data/WebApplicationStructuredData';
import MetaDescription from './MetaDescription';

interface SEOWrapperProps {
  title: string;
  description: string;
  keywords?: string[];
  children: React.ReactNode;
}

export default function SEOWrapper({
  title,
  description,
  keywords,
  children,
}: SEOWrapperProps) {
  return (
    <>
      <MetaDescription
        title={title}
        description={description}
        keywords={keywords}
      />
      <CanonicalUrl />
      <WebApplicationStructuredData />
      {children}
    </>
  );
} 