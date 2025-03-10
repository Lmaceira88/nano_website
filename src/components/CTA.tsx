"use client";

import React from 'react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="bg-primary-600 py-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Barbershop?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of barbershops already using Project Nano to streamline their operations, increase bookings, and delight their clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-primary-50">
              Start Your Free Trial
            </Link>
            <Link href="/demo" className="btn border border-primary-300 text-white hover:bg-primary-700">
              View Live Demo
            </Link>
          </div>
          <p className="text-primary-200 mt-6">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA; 