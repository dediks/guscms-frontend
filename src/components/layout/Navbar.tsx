'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  logoUrl?: string | null;
}

export function Navbar({ logoUrl }: NavbarProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Layanan', href: '#services' },
    { name: 'Keunggulan', href: '#why-us' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Testimoni', href: '#testimonials' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex flex-col leading-none">
                  <span className="text-2xl md:text-3xl font-bold tracking-tighter text-white group-hover:text-brand-gold transition-colors">
                    PLS
                  </span>
                  <span className="text-[0.65rem] md:text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase -mt-1 group-hover:text-white transition-colors">
                    Rental Division
                  </span>
                </div>
              )}
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="px-5 py-2.5 text-sm font-semibold text-brand-dark bg-white hover:bg-neutral-200 transition-colors rounded-sm"
            >
              Konsultasi
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-brand-gold transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-charcoal border-b border-white/10 shadow-2xl">
          <div className="px-6 py-8 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-300 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-block text-center mt-4 px-5 py-3 text-sm font-semibold text-brand-dark bg-white rounded-sm"
            >
              Jadwalkan Konsultasi
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

