"use client";

import React from 'react';
import Link from 'next/link';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '29',
    description: 'Perfect for small barbershops just getting started.',
    features: [
      'Online booking system',
      'Client management',
      'Email reminders',
      'Basic reporting',
      'Up to 3 staff members',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '59',
    description: 'Ideal for growing barbershops with multiple staff members.',
    features: [
      'Everything in Basic',
      'SMS reminders',
      'Advanced reporting',
      'Staff management',
      'Up to 10 staff members',
      'Priority email & chat support'
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '99',
    description: 'For established barbershops with multiple locations.',
    features: [
      'Everything in Professional',
      'Multiple locations',
      'Custom branding',
      'API access',
      'Unlimited staff members',
      'Dedicated account manager'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for your barbershop. All plans include a 14-day free trial.
          </p>
          <div className="mt-6">
            <Link href="/demo" className="btn btn-secondary">
              View Live Demo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-xl overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-primary-500 shadow-lg relative' 
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3">
                  <Link 
                    href={plan.id === 'enterprise' ? '/contact' : '/signup'} 
                    className={`btn w-full text-center ${
                      plan.popular ? 'btn-primary' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <Link 
                    href="/demo" 
                    className="btn w-full text-center bg-transparent border border-primary-300 text-primary-600 hover:bg-primary-50"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need a custom plan? <Link href="/contact" className="text-primary-600 font-medium">Contact us</Link> for a tailored solution.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 