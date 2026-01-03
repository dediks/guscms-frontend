import type { Service } from '@/types/company';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-zinc-50 mb-12 text-center">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
            >
              {service.icon && (
                <div className="text-4xl mb-4">{service.icon}</div>
              )}
              <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-3">
                {service.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {service.description}
              </p>
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start"
                    >
                      <span className="mr-2 text-green-600 dark:text-green-400">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

