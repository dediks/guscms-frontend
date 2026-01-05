import React from 'react';
import { MapPin, Mail, Phone, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <a href="#" className="flex flex-col leading-none mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white">PLS</span>
              <span className="text-[0.6rem] font-bold tracking-widest text-neutral-500 uppercase">Rental Division</span>
            </a>
            <p className="text-sm leading-relaxed mb-6">
              Mitra terpercaya penyewaan sound system dan produksi audio visual premium untuk kebutuhan korporat dan instansi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Area Layanan */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-6">Area Layanan & Cakupan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-start mb-3">
                  <MapPin className="text-brand-gold mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">
                    <strong className="text-neutral-300 block mb-1">Madiun & Sekitarnya</strong>
                    Layanan cepat untuk area Madiun, Magetan, Ponorogo, dan Ngawi dengan dukungan logistik lokal.
                  </p>
                </div>
              </div>
              <div>
                 <div className="flex items-start mb-3">
                  <MapPin className="text-brand-gold mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">
                    <strong className="text-neutral-300 block mb-1">Jawa Timur & Nasional</strong>
                    Siap menangani event di seluruh Jawa Timur hingga skala nasional dengan koordinasi profesional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Kontak Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center">
                <Phone className="mr-3 h-4 w-4 text-brand-gold" />
                <span>0822-5728-9604</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-4 w-4 text-brand-gold" />
                <span>plsrental@yahoo.com</span>
              </li>
              <li className="flex items-start">
                 <MapPin className="mt-1 mr-3 h-4 w-4 text-brand-gold flex-shrink-0" />
                 <span>JL.Raya Kandangan . Kare . MADIUN - Jawa Timur.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
            <p>&copy; {new Date().getFullYear()} PLS Rental Division. All rights reserved.</p>
            <p className="text-neutral-500">
              Powered by{' '}
              <a href="https://kodingus.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">
                GusCMS
              </a>
              {' & '}
              <a href="https://kodingus.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">
                kodingus.com
              </a>
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

