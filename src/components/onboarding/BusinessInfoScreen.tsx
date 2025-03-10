"use client";

import React, { useState, useEffect } from 'react';

interface BusinessInfoScreenProps {
  businessName: string;
  businessType: string;
  email: string; // For display only, not editable
  onUpdate: (data: Partial<{ businessName: string; businessType: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BusinessInfoScreen({
  businessName,
  businessType,
  email,
  onUpdate,
  onNext,
  onBack
}: BusinessInfoScreenProps) {
  const [formValues, setFormValues] = useState({
    businessName,
    businessType
  });
  
  const [formErrors, setFormErrors] = useState({
    businessName: '',
    businessType: ''
  });

  // Update local state when props change
  useEffect(() => {
    setFormValues({
      businessName,
      businessType
    });
  }, [businessName, businessType]);

  const businessTypes = [
    "Barber Shop",
    "Hair Salon",
    "Nail Salon",
    "Spa",
    "Massage Therapy",
    "Personal Training",
    "Yoga Studio",
    "Fitness Center",
    "Other"
  ];

  const validateForm = () => {
    if (!businessName || !businessType) {
      setFormErrors({
        businessName: 'Business name is required',
        businessType: 'Business type is required'
      });
      return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formValues);
      onNext();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-primary-600"></div>
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold">3</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold">4</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Tell us about your business</h1>
      <p className="text-center text-gray-600 mb-8">We'll use this to personalize your experience.</p>
      
      <form onSubmit={handleContinue} className="space-y-6">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formValues.businessName}
            onChange={handleChange}
            placeholder="e.g., Classic Cuts Barbershop"
            className={`w-full px-4 py-3 rounded-lg border ${formErrors.businessName ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {formErrors.businessName && <p className="mt-1 text-sm text-red-500">{formErrors.businessName}</p>}
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
            Business Type
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formValues.businessType}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${formErrors.businessType ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
            required
          >
            <option value="" disabled>Select a business type</option>
            {businessTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          {formErrors.businessType && <p className="mt-1 text-sm text-red-500">{formErrors.businessType}</p>}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">
                Your admin account will be created with the email: <strong>{email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
} 