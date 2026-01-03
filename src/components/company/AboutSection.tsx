import type { AboutSection } from '@/types/company';

interface AboutSectionProps {
  about: AboutSection;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto space-y-8">
        {about.title && (
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-zinc-50">
            {about.title}
          </h2>
        )}
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            {about.description}
          </p>
        </div>

        {about.mission && (
          <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">
              Our Mission
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              {about.mission}
            </p>
          </div>
        )}

        {about.vision && (
          <div className="mt-6 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">
              Our Vision
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              {about.vision}
            </p>
          </div>
        )}

        {about.values && about.values.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
              Our Values
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.values.map((value, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {about.history && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">
              Our History
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 leading-8">
              {about.history}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

