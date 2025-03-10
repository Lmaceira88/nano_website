"use client";

import React, { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: 'How does the online booking system work?',
    answer: 'Our online booking system allows clients to book appointments 24/7 through your website or a dedicated booking page. Clients can select services, choose their preferred barber, and pick available time slots. You can customize your availability, services, and pricing.'
  },
  {
    id: 2,
    question: 'Can I integrate Project Nano with my existing website?',
    answer: 'Yes! Project Nano can be easily integrated with your existing website through our booking widget or direct API integration. We also provide a standalone booking page that you can link to from your website or social media profiles.'
  },
  {
    id: 3,
    question: 'How do the automated reminders work?',
    answer: 'Project Nano sends automated appointment reminders via email and/or SMS (depending on your plan). You can customize the timing and content of these reminders. Clients can confirm or reschedule directly from the reminder, helping to reduce no-shows.'
  },
  {
    id: 4,
    question: 'What payment methods are supported?',
    answer: 'Project Nano supports all major credit cards, debit cards, and digital wallets including Apple Pay and Google Pay. We also support cash payments recorded in the system for in-person transactions.'
  },
  {
    id: 5,
    question: 'Is there a contract or can I cancel anytime?',
    answer: 'There are no long-term contracts with Project Nano. All plans are month-to-month, and you can cancel anytime. If you cancel, you\'ll have access until the end of your current billing period.'
  },
  {
    id: 6,
    question: 'Do you offer a free trial?',
    answer: 'Yes, we offer a 14-day free trial on all plans. No credit card is required to start your trial, and you can upgrade to a paid plan at any time during or after your trial period.'
  }
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="faq" className="section bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Have questions about Project Nano? We've got answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
                  onClick={() => toggleItem(faq.id)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${openItem === faq.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItem === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Still have questions? <a href="/contact" className="text-primary-600 font-medium">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 