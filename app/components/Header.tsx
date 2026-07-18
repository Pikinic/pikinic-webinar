"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-cream-50/90 backdrop-blur-md border-b border-teal-900/10 shadow-sm"
          : "bg-cream-50 border-b border-teal-900/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/logo.svg"
              alt="PiKiNiC"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 text-sm font-medium">
          <Link
            href="/#hero"
            className="text-ink-900/70 hover:text-teal-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#faq"
            className="text-ink-900/70 hover:text-teal-900 transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Right side Actions (CTA + Mobile Hamburger) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="#register-section"
            className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-ink-900 bg-yellow-400 border border-yellow-400 hover:bg-yellow-400/90 hover:border-yellow-400/90 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            Register Now
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-900 hover:bg-teal-900/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-20 bg-cream-50 border-b border-teal-900/10 shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          <Link
            href="/#hero"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-base font-medium text-ink-900 hover:bg-teal-900/5 hover:text-teal-900"
          >
            Home
          </Link>
          <Link
            href="/#faq"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-base font-medium text-ink-900 hover:bg-teal-900/5 hover:text-teal-900"
          >
            FAQ
          </Link>
        </div>
      </div>
    </header>
  );
}
