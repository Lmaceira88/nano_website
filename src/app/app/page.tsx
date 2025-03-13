"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTenant } from '@/contexts/TenantContext';
import { getTenantById } from '@/utils/tenantManager';
import SearchParamsProvider from '@/components/common/SearchParamsProvider';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Wrap page with SearchParamsProvider
export default function AppPage() {
  return (
    <SearchParamsProvider>
      <AppDashboard />
    </SearchParamsProvider>
  );
}

// Actual dashboard content
function AppDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenantId, tenantInfo, user, isLoading: tenantLoading, error: tenantError } = useTenant();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Mock data for dashboard stats
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalClients: 0,
    totalRevenue: 0,
  });
  
  // Mock upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  
  // Mock latest clients
  const [recentClients, setRecentClients] = useState<any[]>([]);
  
  // Track if this is first login
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    if (tenantId) {
      loadDashboardData(tenantId);
    } else if (!tenantLoading && tenantError) {
      setError(tenantError);
      setLoading(false);
    }
  }, [tenantId, tenantLoading, tenantError]);

  // Function to load tenant-specific dashboard data
  const loadDashboardData = async (tenantId: string) => {
    setLoading(true);
    
    try {
      // For demo, generate mock data with tenant ID in values for proof of tenant isolation
      // In a real app, this would be API calls with proper Row-Level Security
      
      // Check if this is the user's first login
      const isFirstTimeUser = localStorage.getItem(`tenant_${tenantId}_visited`) === null;
      setIsFirstLogin(isFirstTimeUser);
      
      if (isFirstTimeUser) {
        localStorage.setItem(`tenant_${tenantId}_visited`, 'true');
      }
      
      // Generate appointments based on tenant ID (for demo only)
      const seed = tenantId.charCodeAt(0) + tenantId.charCodeAt(tenantId.length - 1);
      const totalAppointments = 50 + (seed % 100);
      const upcomingAppointmentsCount = 5 + (seed % 10);
      const clientsCount = 30 + (seed % 70);
      const revenue = 1000 + (seed * 10);
      
      // Update stats
      setStats({
        totalAppointments,
        upcomingAppointments: upcomingAppointmentsCount,
        totalClients: clientsCount,
        totalRevenue: revenue
      });
      
      // Generate upcoming appointments (next 5 days)
      const mockAppointments = [];
      const today = new Date();
      
      const clientNames = [
        'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Johnson', 
        'David Williams', 'Jennifer Davis', 'Robert Miller', 'Amanda Jones'
      ];
      
      const services = [
        'Haircut & Style', 'Beard Trim', 'Hair Coloring', 'Shave',
        'Facial Treatment', 'Hair Consultation', 'Hair & Beard Combo', 'Express Cut'
      ];
      
      for (let i = 0; i < upcomingAppointmentsCount; i++) {
        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() + Math.floor(Math.random() * 5));
        
        const hours = 9 + Math.floor(Math.random() * 8);
        const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        
        appointmentDate.setHours(hours, minutes, 0, 0);
        
        mockAppointments.push({
          id: `appt-${tenantId.substring(0, 4)}-${i}`,
          clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
          serviceName: services[Math.floor(Math.random() * services.length)],
          date: appointmentDate.toISOString().split('T')[0],
          time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
          duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
          status: ['confirmed', 'pending'][Math.floor(Math.random() * 2)]
        });
      }
      
      // Sort appointments by date and time
      mockAppointments.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setUpcomingAppointments(mockAppointments);
      
      // Generate recent clients
      const mockClients = [];
      
      for (let i = 0; i < 5; i++) {
        const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
        const [firstName, lastName] = clientName.split(' ');
        
        mockClients.push({
          id: `client-${tenantId.substring(0, 4)}-${i}`,
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: `07${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
          lastVisit: (() => {
            const lastVisit = new Date();
            lastVisit.setDate(today.getDate() - Math.floor(Math.random() * 30));
            return lastVisit.toISOString().split('T')[0];
          })()
        });
      }
      
      setRecentClients(mockClients);
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem(`tenant_${tenantId}_welcome_dismissed`, 'true');
  };

  if (loading || tenantLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || tenantError) {
    const TenantDebugLink = () => {
      const [tenantIdParam, setTenantIdParam] = useState('');
      
      useEffect(() => {
        if (typeof window !== 'undefined') {
          setTenantIdParam(localStorage.getItem('currentTenantId') || '');
        }
      }, []);
      
      return (
        <Link 
          href={`/admin/tenant-debug?tenantId=${tenantIdParam}`} 
          className="text-sm font-medium text-blue-700 hover:text-blue-600"
        >
          Debug Tenant Issues
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      );
    };
    
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error || tenantError}
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="/auth/login" className="text-sm font-medium text-red-700 hover:text-red-600">
                Go to Login
                <span aria-hidden="true"> &rarr;</span>
              </Link>
              <TenantDebugLink />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome message for first login */}
      {isFirstLogin && showWelcome && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Welcome to your Project Nano dashboard!</h2>
              <p className="text-blue-100">
                This is your personalized tenant space where you can manage your business. 
                All your data is isolated and secure.
              </p>
              <div className="mt-4 flex space-x-4">
                <button 
                  className="bg-white text-blue-700 px-4 py-2 rounded shadow-sm hover:bg-blue-50 transition-colors"
                  onClick={() => router.push('/app/onboarding')}
                >
                  Take a tour
                </button>
                <button 
                  className="bg-blue-700 text-white px-4 py-2 rounded shadow-sm hover:bg-blue-600 transition-colors"
                  onClick={dismissWelcome}
                >
                  Get started
                </button>
              </div>
            </div>
            <button 
              onClick={dismissWelcome}
              className="text-blue-200 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Tenant greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user?.name || 'there'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening at {tenantInfo?.name || 'your business'} today
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium uppercase leading-none">Appointments</p>
              <p className="font-bold text-xl text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium uppercase leading-none">Upcoming</p>
              <p className="font-bold text-xl text-gray-900">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium uppercase leading-none">Clients</p>
              <p className="font-bold text-xl text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium uppercase leading-none">Revenue</p>
              <p className="font-bold text-xl text-gray-900">£{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-900">Upcoming Appointments</h2>
          </div>
          
          <div className="p-4">
            {upcomingAppointments.length > 0 ? (
              <div className="overflow-hidden">
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {upcomingAppointments.map((appointment, index) => (
                      <li key={appointment.id}>
                        <div className="relative pb-8">
                          {index !== upcomingAppointments.length - 1 ? (
                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.clientName}
                                  <span className={`ml-2 text-xs font-semibold inline-block py-1 px-2 rounded ${
                                    appointment.status === 'confirmed' 
                                      ? 'text-green-800 bg-green-100' 
                                      : 'text-yellow-800 bg-yellow-100'
                                  }`}>
                                    {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {new Date(appointment.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })} at {appointment.time}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{appointment.serviceName} ({appointment.duration} min)</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 self-center">
                              <Link 
                                href={`/app/appointments/${appointment.id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No upcoming appointments</p>
                <Link 
                  href="/app/appointments/new" 
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Schedule appointment
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <Link 
              href="/app/appointments" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all appointments
            </Link>
          </div>
        </div>
        
        {/* Quick actions + recent clients */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4">
              <Link
                href="/app/appointments/new"
                className="inline-flex flex-col items-center px-4 py-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-900">New Appointment</span>
              </Link>
              
              <Link
                href="/app/clients/new"
                className="inline-flex flex-col items-center px-4 py-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Add Client</span>
              </Link>
              
              <Link
                href="/app/services"
                className="inline-flex flex-col items-center px-4 py-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Manage Services</span>
              </Link>
              
              <Link
                href="/app/settings"
                className="inline-flex flex-col items-center px-4 py-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Settings</span>
              </Link>
            </div>
          </div>
          
          {/* Recent clients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-900">Recent Clients</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentClients.length > 0 ? (
                recentClients.map(client => (
                  <div key={client.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Last visit: {new Date(client.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Link 
                          href={`/app/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm">No clients yet</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <Link 
                href="/app/clients" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all clients
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 