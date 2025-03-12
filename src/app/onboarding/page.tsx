"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AccountCreationScreen from "@/components/onboarding/AccountCreationScreen";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import BusinessInfoScreen from "@/components/onboarding/BusinessInfoScreen";
import ServiceSelectionScreen from "@/components/onboarding/ServiceSelectionScreen";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define the steps of the onboarding process
const ONBOARDING_STEPS = {
  ACCOUNT_CREATION: 'account_creation',
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
  const { user, isLoading: authLoading, signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.ACCOUNT_CREATION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    subdomain: "",
    selectedService: "",
  });

  // Check if user is already authenticated, if so, skip account creation
  useEffect(() => {
    if (!authLoading && user) {
      // User is already logged in, skip to welcome or business info
      setCurrentStep(ONBOARDING_STEPS.WELCOME);
      
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
  }, [user, authLoading]);

  const handleNextStep = () => {
    if (currentStep === ONBOARDING_STEPS.ACCOUNT_CREATION) {
      setCurrentStep(ONBOARDING_STEPS.WELCOME);
    } else if (currentStep === ONBOARDING_STEPS.WELCOME) {
      setCurrentStep(ONBOARDING_STEPS.BUSINESS_INFO);
    } else if (currentStep === ONBOARDING_STEPS.BUSINESS_INFO) {
      setCurrentStep(ONBOARDING_STEPS.SERVICE_SELECTION);
    }
    // We'll handle moving beyond SERVICE_SELECTION in handleSubmit
  };

  const handlePrevStep = () => {
    if (currentStep === ONBOARDING_STEPS.WELCOME) {
      // Only go back to account creation if user isn't already logged in
      if (!user) {
        setCurrentStep(ONBOARDING_STEPS.ACCOUNT_CREATION);
      }
      // Otherwise, there's no previous step for an existing user
    } else if (currentStep === ONBOARDING_STEPS.BUSINESS_INFO) {
      setCurrentStep(ONBOARDING_STEPS.WELCOME);
    } else if (currentStep === ONBOARDING_STEPS.SERVICE_SELECTION) {
      setCurrentStep(ONBOARDING_STEPS.BUSINESS_INFO);
    }
  };

  const handleUpdateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCreateAccount = async (email: string, password: string) => {
    // Call Auth Context's signUp method to create the account
    const metadata = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      created_at: new Date().toISOString(),
    };
    
    try {
      const { error, user } = await signUp(email, password, metadata);
      return { error };
    } catch (err: any) {
      console.error("Account creation error:", err);
      return { error: err };
    }
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
          subdomain: formData.subdomain,
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
      
      // Generate a proper UUID for tenant ID using crypto API
      // This matches the UUID format we use in Supabase
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, 
                v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const tenantId = generateUUID();
      
      // Store tenant ID in localStorage for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentTenantId', tenantId);
        
        // Create basic tenant info to display in dashboard
        const tenantInfo = {
          id: tenantId,
          name: formData.businessName,
          type: formData.businessType,
          subdomain: formData.subdomain,
        };
        localStorage.setItem('tenantInfo', JSON.stringify(tenantInfo));
        
        // Create tenant in Supabase (in real implementation)
        // For now, just simulate the creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message with tenant ID and subdomain URL
        const subdomainUrl = process.env.NODE_ENV === 'production'
          ? `https://${formData.subdomain}.projectnano.co.uk`
          : `http://localhost:3010/app?tenant=${tenantId}`;
        
        setSuccessMessage(`Your tenant has been created successfully!
        
        Tenant ID: ${tenantId}
        
        Your business URL: ${subdomainUrl}
        
        You'll be redirected to your dashboard in a moment...`);
      }
      
      // Wait a few seconds to show the tenant ID before redirecting
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // In production, redirect to the tenant subdomain
      // In development, use query parameters
      if (process.env.NODE_ENV === 'production') {
        // Use subdomain in production
        window.location.href = `https://${formData.subdomain}.projectnano.co.uk/app/dashboard`;
      } else {
        // Use query parameters in development
        router.push(`/app/dashboard?tenant=${tenantId}`);
      }
    } catch (error) {
      console.error('Error during onboarding submission:', error);
      setError('Failed to complete onboarding. Please try again.');
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.ACCOUNT_CREATION:
        return (
          <AccountCreationScreen
            email={formData.email}
            firstName={formData.firstName}
            lastName={formData.lastName}
            password={formData.password}
            onUpdate={handleUpdateFormData}
            onNext={handleNextStep}
            onAccountCreate={handleCreateAccount}
          />
        );
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
            subdomain={formData.subdomain}
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
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="container-custom">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {successMessage ? (
              <div className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Complete!</h2>
                <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-left">
                  <p className="text-gray-800 whitespace-pre-line">{successMessage}</p>
                </div>
                <div className="animate-pulse text-gray-500">
                  Redirecting...
                </div>
              </div>
            ) : (
              renderStep()
            )}
            
            {/* Loading message that appears when submitting form */}
            {isLoading && !successMessage && (
              <LoadingOverlay message="Creating your business on projectnano.co.uk..." />
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