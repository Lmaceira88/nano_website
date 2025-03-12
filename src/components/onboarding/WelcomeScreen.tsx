"use client";

import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onUpdate: (data: Partial<{ firstName: string; lastName: string; email: string; phone: string }>) => void;
  onNext: () => void;
}

export default function WelcomeScreen({
  firstName,
  lastName,
  email,
  phone,
  onUpdate,
  onNext
}: WelcomeScreenProps) {
  const [formValues, setFormValues] = useState({
    firstName,
    lastName,
    email,
    phone,
  });
  
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [error, setError] = useState('');

  // Update local state when props change
  useEffect(() => {
    setFormValues({
      firstName,
      lastName,
      email,
      phone,
    });
  }, [firstName, lastName, email, phone]);

  const validateForm = () => {
    if (!firstName || !lastName || !email) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-blue-600"></div>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-semibold">3</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-semibold">4</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Welcome to Project Nano!</h1>
      <p className="text-center text-gray-600 mb-8">Let's get you started with your 7-day free trial. We already have your account info, now let's get some more details.</p>
      
      <form onSubmit={handleContinue} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              placeholder="John"
              className={`w-full px-4 py-3 rounded-lg border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
              required
            />
            {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={`w-full px-4 py-3 rounded-lg border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
              required
            />
            {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="+44 7700 900000"
            className={`w-full px-4 py-3 rounded-lg border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
          <p className="mt-1 text-sm text-gray-500">We'll use this for important account notifications.</p>
        </div>

        <div className="mt-8 text-center">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Continue
          </button>
          <p className="mt-4 text-sm text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
} 