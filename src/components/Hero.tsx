"use client";

import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-white to-primary-50 py-20 md:py-32">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Barbershop Management Made <span className="text-primary-600">Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Project Nano helps barbershops streamline appointments, payments, and client management with an all-in-one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn btn-primary">
                Get Started Free
              </Link>
              <Link href="/demo" className="btn btn-secondary">
                View Live Demo
              </Link>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-medium text-gray-600">U{i}</span>
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">500+</span> barbershops trust Project Nano
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 p-4">
                <div className="w-full h-full bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">Hero Image</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">+</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Bookings Up</p>
                  <p className="text-xl font-bold text-primary-600">32%</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">-</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">No-shows</p>
                  <p className="text-xl font-bold text-primary-600">24%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 