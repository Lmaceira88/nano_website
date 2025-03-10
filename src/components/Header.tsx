"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Project Nano</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-primary-600 font-medium">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-primary-600 font-medium">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-primary-600 font-medium">
              FAQ
            </Link>
            <Link href="/project-plan" className="text-gray-600 hover:text-primary-600 font-medium">
              Project Plan
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-600 hover:text-primary-600 font-medium">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-primary-600 font-medium">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium">
                Pricing
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-primary-600 font-medium">
                FAQ
              </Link>
              <Link href="/project-plan" className="text-gray-600 hover:text-primary-600 font-medium">
                Project Plan
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link href="/login" className="block text-gray-600 hover:text-primary-600 font-medium mb-4">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary w-full text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 