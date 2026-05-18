interface MDXRendererProps {
  content: string;
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  return (
    <article
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
