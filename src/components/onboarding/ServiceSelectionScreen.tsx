"use client";

import React, { useState } from 'react';

// Define the Service type 
interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
}

interface ServiceSelectionScreenProps {
  selectedService: string;
  onUpdate: (data: Partial<{ selectedService: string }>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ServiceSelectionScreen({
  selectedService,
  onUpdate,
  onSubmit,
  onBack
}: ServiceSelectionScreenProps) {
  // Track the selected service as a full Service object for UI, but only pass the ID back
  const [selectedServiceObj, setSelectedServiceObj] = useState<Service | null>(null);
  const [error, setError] = useState('');

  // Sample services - in a real app, these would come from an API
  const services: Service[] = [
    {
      id: "haircut",
      name: "Haircut Service",
      description: "Full-service haircuts and styling for all ages and preferences.",
      duration: "30-45 min",
      price: "$25-$45"
    },
    {
      id: "coloring",
      name: "Hair Coloring",
      description: "Professional hair coloring, highlights, and color correction services.",
      duration: "60-120 min",
      price: "$75-$200"
    },
    {
      id: "styling",
      name: "Hair Styling",
      description: "Special occasion styling, blowouts, and formal updos.",
      duration: "45-90 min",
      price: "$50-$100"
    },
    {
      id: "facial",
      name: "Facial Treatment",
      description: "Revitalizing facials customized to your skin type and concerns.",
      duration: "60 min",
      price: "$60-$120"
    }
  ];

  // Set initial selected service from props if available
  React.useEffect(() => {
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      if (service) {
        setSelectedServiceObj(service);
      }
    }
  }, [selectedService]);

  const validateForm = () => {
    if (!selectedServiceObj) {
      setError('Please select a service to continue');
      return false;
    }
    return true;
  };

  const handleSelectService = (service: Service) => {
    setSelectedServiceObj(service);
    onUpdate({ selectedService: service.id });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      {/* Progress indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-blue-600"></div>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-blue-600"></div>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
          <div className="w-20 h-1 bg-blue-600"></div>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">4</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Select Your Service Package</h1>
      <p className="text-center text-gray-600 mb-8">Choose the service that best fits your business needs.</p>

      {/* Information box about final step */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
        <p>This is the final step. After selecting a service, your account will be created on projectnano.co.uk and you'll be redirected to your dashboard.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`cursor-pointer border rounded-lg p-4 transition-all ${
              selectedServiceObj?.id === service.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleSelectService(service)}
          >
            <div className="flex justify-between items-start">
              <h3 className={`font-semibold text-lg ${selectedServiceObj?.id === service.id ? 'text-blue-700' : 'text-gray-800'}`}>{service.name}</h3>
              <span className="text-blue-600 font-medium">{service.price}</span>
            </div>
            <p className="text-gray-600 mt-1">{service.description}</p>
            <div className="mt-3 text-sm text-gray-500">Duration: {service.duration}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedServiceObj}
          className={`px-4 py-2 text-white rounded-md ${
            selectedServiceObj
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
} 