"use client";

import React, { useState, useEffect } from 'react';

interface BillingSetupScreenProps {
  cardNumber: string;
  expirationDate: string;
  cvc: string;
  billingZip: string;
  onUpdateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const BillingSetupScreen: React.FC<BillingSetupScreenProps> = ({
  cardNumber,
  expirationDate,
  cvc,
  billingZip,
  onUpdateFormData,
  onNext,
  onBack
}) => {
  const [formValues, setFormValues] = useState({
    cardNumber,
    expirationDate,
    cvc,
    billingZip
  });
  
  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    billingZip: ''
  });

  // Update local state when props change
  useEffect(() => {
    setFormValues({
      cardNumber,
      expirationDate,
      cvc,
      billingZip
    });
  }, [cardNumber, expirationDate, cvc, billingZip]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      cardNumber: '',
      expirationDate: '',
      cvc: '',
      billingZip: ''
    };
    
    // Simple validation - in a real app, you'd want more thorough validation
    if (formValues.cardNumber.length < 15) {
      errors.cardNumber = 'Please enter a valid card number';
      isValid = false;
    }
    
    if (formValues.expirationDate.length < 5) {
      errors.expirationDate = 'Please enter a valid expiration date';
      isValid = false;
    }
    
    if (formValues.cvc.length < 3) {
      errors.cvc = 'Please enter a valid CVC';
      isValid = false;
    }
    
    if (formValues.billingZip.length < 5) {
      errors.billingZip = 'Please enter a valid ZIP code';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdateFormData(formValues);
      onNext();
    }
  };

  // Format card number with spaces
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
    
    setFormValues(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  // Format expiration date (MM/YY)
  const formatExpirationDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    setFormValues(prev => ({
      ...prev,
      expirationDate: value
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-primary-600"></div>
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-primary-600"></div>
          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">3</div>
          <div className="w-20 h-1 bg-gray-300"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold">4</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Start your 7-day free trial</h1>
      <p className="text-center text-gray-600 mb-8">No charges will be made during the trial. Add your card to continue.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formValues.cardNumber}
            onChange={formatCardNumber}
            placeholder="•••• •••• •••• ••••"
            maxLength={19}
            className={`w-full px-4 py-3 rounded-lg border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {formErrors.cardNumber && <p className="mt-1 text-sm text-red-500">{formErrors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              value={formValues.expirationDate}
              onChange={formatExpirationDate}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full px-4 py-3 rounded-lg border ${formErrors.expirationDate ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
              required
            />
            {formErrors.expirationDate && <p className="mt-1 text-sm text-red-500">{formErrors.expirationDate}</p>}
          </div>

          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="password"
              id="cvc"
              name="cvc"
              value={formValues.cvc}
              onChange={handleChange}
              placeholder="•••"
              maxLength={4}
              className={`w-full px-4 py-3 rounded-lg border ${formErrors.cvc ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
              required
            />
            {formErrors.cvc && <p className="mt-1 text-sm text-red-500">{formErrors.cvc}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700 mb-1">
            Billing Zip Code
          </label>
          <input
            type="text"
            id="billingZip"
            name="billingZip"
            value={formValues.billingZip}
            onChange={handleChange}
            placeholder="10001"
            maxLength={10}
            className={`w-full px-4 py-3 rounded-lg border ${formErrors.billingZip ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {formErrors.billingZip && <p className="mt-1 text-sm text-red-500">{formErrors.billingZip}</p>}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Your card will not be charged until after the 7-day trial.</strong> You can cancel anytime without being charged.
          </p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Immediate access to all features upon completing signup</li>
            <li>You'll receive email reminders before your trial ends</li>
            <li>Easy cancellation available in your account dashboard</li>
            <li>No hidden fees or commitments</li>
          </ul>
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
            Start My Free Trial
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingSetupScreen; 