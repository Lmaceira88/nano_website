"use client";

import React from 'react';

const testimonials = [
  {
    id: 1,
    content: "Project Nano has completely transformed how we run our barbershop. We've increased bookings by 40% and reduced no-shows significantly.",
    author: "James Wilson",
    role: "Owner, Classic Cuts Barbershop",
    avatar: "/images/avatar-1.jpg"
  },
  {
    id: 2,
    content: "The client management features are incredible. We can keep track of preferences and history, which has helped us provide a much more personalized service.",
    author: "Sarah Johnson",
    role: "Manager, Urban Styles",
    avatar: "/images/avatar-2.jpg"
  },
  {
    id: 3,
    content: "I was skeptical at first, but after using Project Nano for just one month, I can't imagine running my shop without it. The ROI has been amazing.",
    author: "Michael Brown",
    role: "Owner, The Gentleman's Cut",
    avatar: "/images/avatar-3.jpg"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section bg-secondary-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Barbershops Everywhere</h2>
          <p className="text-xl text-gray-600">
            See what barbershop owners and managers are saying about Project Nano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-medium text-gray-600">
                      {testimonial.author.split(' ').map(name => name[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white">
            <span className="text-gray-700 font-medium mr-2">Rated 4.9/5 based on</span>
            <span className="text-primary-600 font-bold">500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 