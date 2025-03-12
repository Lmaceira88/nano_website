"use client";

import React, { useState, useEffect } from 'react';
import { AUTH_CONFIG } from '@/utils/authConfig';

interface AccountCreationScreenProps {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  onUpdate: (data: Partial<{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }>) => void;
  onNext: () => void;
  onAccountCreate: (email: string, password: string) => Promise<{error: any | null}>;
}

export default function AccountCreationScreen({
  email,
  firstName,
  lastName,
  password,
  onUpdate,
  onNext,
  onAccountCreate
}: AccountCreationScreenProps) {
  const [formValues, setFormValues] = useState({
    email: email || '',
    firstName: firstName || '',
    lastName: lastName || '',
    password: password || '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update parent form when local state changes
  useEffect(() => {
    onUpdate(formValues);
  }, [formValues, onUpdate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formValues.firstName) newErrors.firstName = 'First name is required';
    if (!formValues.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formValues.password) {
      newErrors.password = 'Password is required';
    } else if (formValues.password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters`;
    }
    
    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // This calls the parent component's account creation function
      const { error } = await onAccountCreate(formValues.email, formValues.password);
      
      if (error) {
        if (error.message.includes('email')) {
          setErrors(prev => ({ ...prev, email: error.message }));
        } else {
          setErrors(prev => ({ ...prev, general: error.message }));
        }
        return;
      }
      
      // Move to the next step
      onNext();
    } catch (err: any) {
      setErrors(prev => ({ ...prev, general: err.message || 'An error occurred' }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-semibold">2</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-semibold">3</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-semibold">4</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Create Your Account</h1>
      <p className="text-center text-gray-600 mb-8">Let's get you started with Project Nano.</p>
      
      <form onSubmit={handleContinue}>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="John"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          <p className="mt-1 text-sm text-gray-500">We'll send a verification link to this email.</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="●●●●●●●●"
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          <p className="mt-1 text-sm text-gray-500">Must be at least {AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters long.</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="●●●●●●●●"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <div className="mt-8 text-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account & Continue'}
          </button>
          <p className="mt-4 text-sm text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
} 