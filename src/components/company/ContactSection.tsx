import type { ContactInfo } from '@/types/company';

interface ContactSectionProps {
  contact: ContactInfo;
}

export function ContactSection({ contact }: ContactSectionProps) {
  const hasContactInfo =
    contact.email ||
    contact.phone ||
    contact.address ||
    (contact.socialLinks && contact.socialLinks.length > 0);

  if (!hasContactInfo) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-zinc-50 mb-12 text-center">
          Get In Touch
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {contact.email && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">
                  Email
                </h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-lg text-black dark:text-zinc-50 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            )}
            
            {contact.phone && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">
                  Phone
                </h3>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-lg text-black dark:text-zinc-50 hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            )}
            
            {(contact.address || contact.city || contact.state) && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">
                  Address
                </h3>
                <address className="text-lg text-black dark:text-zinc-50 not-italic">
                  {contact.address && <div>{contact.address}</div>}
                  {(contact.city || contact.state || contact.zipCode) && (
                    <div>
                      {contact.city && <span>{contact.city}</span>}
                      {contact.city && contact.state && <span>, </span>}
                      {contact.state && <span>{contact.state}</span>}
                      {contact.zipCode && <span> {contact.zipCode}</span>}
                    </div>
                  )}
                  {contact.country && <div>{contact.country}</div>}
                </address>
              </div>
            )}
          </div>
          
          {contact.socialLinks && contact.socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-4">
                {contact.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

