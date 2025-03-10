"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ProjectPlan {
  projectName: string;
  description: string;
  businessModel: {
    type: string;
    subscriptionPlans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  projectComponents: Array<{
    name: string;
    status: string;
    features: string[];
  }>;
  developmentRoadmap: Array<{
    phase: string;
    timeline: string;
    status: string;
    tasks: string[];
  }>;
  // Add other properties as needed
}

export default function ProjectPlanPage() {
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectPlan = async () => {
      try {
        const response = await fetch('/project-plan.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch project plan: ${response.status}`);
        }
        const data = await response.json();
        setProjectPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching project plan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectPlan();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                <div className="h-64 bg-gray-200 rounded w-full mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Project Plan</h1>
              <p className="text-gray-700 mb-8">{error}</p>
              <p className="text-gray-600">
                Please make sure the project-plan.json file exists at the root of the website.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!projectPlan) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">No Project Plan Found</h1>
              <p className="text-gray-600">
                The project plan could not be loaded. Please make sure the project-plan.json file exists.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{projectPlan.projectName}</h1>
            <p className="text-xl text-gray-600 mb-12">{projectPlan.description}</p>

            {/* Business Model Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Business Model
              </h2>
              <p className="text-gray-700 mb-6">
                <span className="font-semibold">Type:</span> {projectPlan.businessModel.type}
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Subscription Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectPlan.businessModel.subscriptionPlans.map((plan, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-primary-600 font-bold mb-4">{plan.price}</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Project Components Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Project Components
              </h2>
              <div className="space-y-8">
                {projectPlan.projectComponents.map((component, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{component.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        component.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {component.status}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {component.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Development Roadmap Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Development Roadmap
              </h2>
              <div className="space-y-8">
                {projectPlan.developmentRoadmap.map((phase, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
                      <div className="flex items-center mt-2 md:mt-0">
                        <span className="text-gray-500 mr-4">{phase.timeline}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          phase.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {phase.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                This is a partial view of the project plan. For the complete plan, please refer to the project-plan.json file.
              </p>
              <a 
                href="/project-plan.json" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                View Full Project Plan (JSON)
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 