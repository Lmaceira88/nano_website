"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '29',
    description: 'Perfect for small businesses just getting started.',
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
    description: 'Ideal for growing businesses with multiple staff members.',
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
    description: 'For established businesses with multiple locations.',
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing-plans" className="section" aria-labelledby="pricing-title">
      <div className="container-custom">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12" role="group" aria-label="Billing cycle selection">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center">
            <button 
              className={`px-4 py-2 rounded-lg ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => setBillingCycle('monthly')}
              aria-pressed={billingCycle === 'monthly'}
              aria-label="Switch to monthly billing"
            >
              Monthly
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${billingCycle === 'yearly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => setBillingCycle('yearly')}
              aria-pressed={billingCycle === 'yearly'}
              aria-label="Switch to yearly billing (Save 20%)"
            >
              Yearly <span className="text-xs font-medium ml-1 text-blue-700">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-white shadow-xl border border-blue-500'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
              aria-label={`${plan.name} plan`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-bold" aria-label="Most popular plan">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                <p className="text-gray-600 mb-6 min-h-[3rem]">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-5xl font-bold text-gray-900">£{billingCycle === 'yearly' ? Math.round(parseInt(plan.price) * 0.8) : plan.price}</span>
                    <span className="text-gray-600 ml-2 mb-1">/month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-blue-600 text-sm mt-1">
                      Billed as £{Math.round(parseInt(plan.price) * 0.8 * 12)} annually
                    </p>
                  )}
                </div>
                
                <div className="border-t border-gray-200 my-6 pt-6">
                  <h4 className="text-gray-900 font-semibold mb-4">What's included:</h4>
                  <ul className="space-y-3 mb-8" aria-label={`Features of the ${plan.name} plan`}>
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href={plan.id === 'enterprise' ? '/contact' : '/onboarding'}
                    className={`w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                    }`}
                    aria-label={`${plan.cta} with the ${plan.name} plan`}
                  >
                    {plan.cta}
                  </Link>
                  <div className="text-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">
                      Start with a 7-day free trial
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      No charges until your trial ends. Cancel anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-blue-50 p-8 rounded-xl border border-blue-100 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a custom plan?</h3>
          <p className="text-gray-600 mb-6">
            We offer tailored solutions for larger businesses with special requirements.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors border border-gray-300"
            aria-label="Contact our sales team for a custom plan"
          >
            Contact our sales team
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 