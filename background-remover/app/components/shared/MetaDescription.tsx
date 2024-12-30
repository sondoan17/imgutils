interface MetaDescriptionProps {
  title: string;
  description: string;
  keywords?: string[];
}

export default function MetaDescription({ title, description, keywords }: MetaDescriptionProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
    </>
  );
} 