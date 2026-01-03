import Image from 'next/image';
import type { CompanyProfile } from '@/types/company';

interface CompanyHeaderProps {
  company: CompanyProfile;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <header className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        {company.logo && (
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-zinc-50">
            {company.name}
          </h1>
          {company.tagline && (
            <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400">
              {company.tagline}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

