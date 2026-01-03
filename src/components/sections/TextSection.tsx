import type { CMSSection } from '@/types/cms';

interface TextSectionProps {
  section: CMSSection;
}

export function TextSection({ section }: TextSectionProps) {
  const fields = section.fields;
  
  // Extract text content from fields
  // Since text sections might have different field structures,
  // we'll render all text fields
  const textFields = Object.entries(fields)
    .filter(([_, field]) => field.type === 'text' && field.value)
    .map(([key, field]) => ({ key, value: field.value }));

  if (textFields.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert max-w-none">
        {textFields.map(({ key, value }) => (
          <div key={key} className="mb-6">
            {value && (
              <div
                className="text-zinc-700 dark:text-zinc-300 leading-8"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

