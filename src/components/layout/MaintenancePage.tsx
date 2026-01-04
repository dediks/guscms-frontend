import React from 'react';

interface MaintenancePageProps {
  message: string | null;
}

export function MaintenancePage({ message }: MaintenancePageProps) {
  const displayMessage = message || 'Situs sedang dalam pemeliharaan. Kami akan kembali segera.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Sedang Maintenance
          </h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
        </div>
        
        <div className="bg-brand-charcoal/50 border border-white/10 rounded-lg p-8 md:p-12 backdrop-blur-sm">
          <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
            {displayMessage}
          </p>
        </div>

        <div className="mt-12">
          <p className="text-sm text-neutral-500">
            Terima kasih atas pengertian Anda.
          </p>
        </div>
      </div>
    </div>
  );
}

