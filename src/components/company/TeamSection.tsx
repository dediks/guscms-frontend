import Image from 'next/image';
import type { TeamMember } from '@/types/company';

interface TeamSectionProps {
  team: TeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-zinc-50 mb-12 text-center">
          Our Team
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center space-y-4"
            >
              {member.photo ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-4xl text-zinc-500 dark:text-zinc-400">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                  {member.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {member.role}
                </p>
              </div>
              
              {member.bio && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {member.bio}
                </p>
              )}
              
              {member.socialLinks && member.socialLinks.length > 0 && (
                <div className="flex space-x-4 pt-2">
                  {member.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
                      aria-label={link.platform}
                    >
                      {link.icon || link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

