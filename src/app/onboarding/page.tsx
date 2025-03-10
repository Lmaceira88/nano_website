"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import BusinessInfoScreen from "@/components/onboarding/BusinessInfoScreen";
import ServiceSelectionScreen from "@/components/onboarding/ServiceSelectionScreen";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define the steps of the onboarding process
const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  BUSINESS_INFO: 'business_info',
  SERVICE_SELECTION: 'service_selection',
};

// Define API endpoint - in production this would be the actual projectnano.co.uk endpoint
const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? 'https://projectnano.co.uk/api/onboarding'
  : '/api/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    selectedService: "",
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else if (user) {
      // Pre-fill form data from user metadata if available
      const metadata = user.user_metadata;
      if (metadata) {
        setFormData(prev => ({
          ...prev,
          firstName: metadata.first_name || '',
          lastName: metadata.last_name || '',
          email: user.email || '',
          phone: metadata.phone || '',
        }));
      }
    }
  }, [user, authLoading, router]);

  const handleNextStep = () => {
    if (currentStep === ONBOARDING_STEPS.WELCOME) {
      setCurrentStep(ONBOARDING_STEPS.BUSINESS_INFO);
    } else if (currentStep === ONBOARDING_STEPS.BUSINESS_INFO) {
      setCurrentStep(ONBOARDING_STEPS.SERVICE_SELECTION);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === ONBOARDING_STEPS.BUSINESS_INFO) {
      setCurrentStep(ONBOARDING_STEPS.WELCOME);
    } else if (currentStep === ONBOARDING_STEPS.SERVICE_SELECTION) {
      setCurrentStep(ONBOARDING_STEPS.BUSINESS_INFO);
    }
  };

  const handleUpdateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Prepare the data to send to ProjectNano.co.uk
      const onboardingData = {
        user_id: user?.id,
        admin: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        business: {
          name: formData.businessName,
          type: formData.businessType,
        },
        service: formData.selectedService,
      };

      // Simulate API call to ProjectNano.co.uk
      console.log('Sending data to ProjectNano.co.uk:', onboardingData);
      
      // In a real implementation, you would make an API call here
      // const response = await fetch('https://api.projectnano.co.uk/onboarding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(onboardingData),
      // });
      
      // For now, simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate getting a token back from the API
      const token = `sim_${Math.random().toString(36).substring(2, 15)}`;
      
      // Redirect to the dashboard with the token
      router.push(`/dashboard?token=${token}`);
    } catch (error) {
      console.error('Error during onboarding submission:', error);
      setError('Failed to complete onboarding. Please try again.');
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        return (
          <WelcomeScreen
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            phone={formData.phone}
            onUpdate={handleUpdateFormData}
            onNext={handleNextStep}
          />
        );
      case ONBOARDING_STEPS.BUSINESS_INFO:
        return (
          <BusinessInfoScreen
            businessName={formData.businessName}
            businessType={formData.businessType}
            email={formData.email}
            onUpdate={handleUpdateFormData}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case ONBOARDING_STEPS.SERVICE_SELECTION:
        return (
          <ServiceSelectionScreen
            selectedService={formData.selectedService}
            onUpdate={handleUpdateFormData}
            onSubmit={handleSubmit}
            onBack={handlePrevStep}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {renderStep()}
            
            {/* Loading message that appears when submitting form */}
            {isLoading && (
              <LoadingOverlay message="Creating your account on projectnano.co.uk..." />
            )}
            
            {error && (
              <div className="fixed inset-x-0 top-4 flex justify-center z-50">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                  <button 
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setError("")}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 