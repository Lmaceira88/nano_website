"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/contexts/TenantContext';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
  popular: boolean;
}

export default function ServicesPage() {
  const { tenantId, tenantInfo } = useTenant();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showInactiveServices, setShowInactiveServices] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Categories for services
  const categories = [
    'Haircut',
    'Styling',
    'Color',
    'Treatment',
    'Beard',
    'Facial',
    'Other'
  ];
  
  useEffect(() => {
    if (tenantId) {
      fetchServices(tenantId);
    }
  }, [tenantId]);
  
  const fetchServices = async (tenantId: string) => {
    setLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock services based on tenant ID for demo
      const mockServices: Service[] = [];
      
      // Create deterministic but tenant-specific services
      const seed = tenantId.charCodeAt(0) + tenantId.charCodeAt(tenantId.length - 1);
      
      // Basic services that most salons/barbers would have
      const baseServices = [
        {
          name: 'Men\'s Haircut',
          description: 'Classic haircut with styling',
          duration: 30,
          price: 25,
          category: 'Haircut',
          active: true,
          popular: true
        },
        {
          name: 'Women\'s Haircut',
          description: 'Haircut and blow dry',
          duration: 45,
          price: 40,
          category: 'Haircut',
          active: true,
          popular: true
        },
        {
          name: 'Beard Trim',
          description: 'Shape and trim beard',
          duration: 15,
          price: 15,
          category: 'Beard',
          active: true,
          popular: true
        },
        {
          name: 'Hair Coloring',
          description: 'Full color treatment',
          duration: 90,
          price: 85,
          category: 'Color',
          active: true,
          popular: false
        },
        {
          name: 'Highlights',
          description: 'Partial or full highlights',
          duration: 120,
          price: 95,
          category: 'Color',
          active: true,
          popular: false
        },
        {
          name: 'Blowout & Style',
          description: 'Wash, blow dry and style',
          duration: 45,
          price: 35,
          category: 'Styling',
          active: true,
          popular: false
        },
        {
          name: 'Deep Conditioning',
          description: 'Intensive hair treatment',
          duration: 30,
          price: 25,
          category: 'Treatment',
          active: true,
          popular: false
        },
        {
          name: 'Facial',
          description: 'Cleansing and rejuvenating facial',
          duration: 60,
          price: 55,
          category: 'Facial',
          active: true,
          popular: false
        },
        {
          name: 'Hair & Beard Combo',
          description: 'Haircut with beard trim and styling',
          duration: 45,
          price: 40,
          category: 'Haircut',
          active: true,
          popular: true
        },
        {
          name: 'Kids Haircut',
          description: 'Haircut for children under 12',
          duration: 20,
          price: 18,
          category: 'Haircut',
          active: true,
          popular: false
        },
        {
          name: 'Senior Haircut',
          description: 'Haircut for seniors 65+',
          duration: 30,
          price: 20,
          category: 'Haircut',
          active: true,
          popular: false
        },
        {
          name: 'Bridal Hair',
          description: 'Wedding day hair styling',
          duration: 120,
          price: 150,
          category: 'Styling',
          active: false,
          popular: false
        }
      ];
      
      // Add base services with some tenant-specific variations
      baseServices.forEach((service, index) => {
        // Adjust prices slightly based on tenant ID to simulate different pricing strategies
        const priceAdjustment = ((seed % 20) - 10) / 100; // -10% to +10%
        const adjustedPrice = Math.round(service.price * (1 + priceAdjustment));
        
        mockServices.push({
          id: `service-${tenantId.substring(0, 4)}-${index}`,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: adjustedPrice,
          category: service.category,
          active: service.active,
          popular: service.popular
        });
      });
      
      // Add a few tenant-specific services based on the tenant ID
      if (seed % 3 === 0) {
        mockServices.push({
          id: `service-${tenantId.substring(0, 4)}-special-1`,
          name: 'Premium Grooming Package',
          description: 'Complete grooming experience including haircut, beard trim, facial, and scalp massage',
          duration: 90,
          price: 95,
          category: 'Other',
          active: true,
          popular: true
        });
      }
      
      if (seed % 4 === 0) {
        mockServices.push({
          id: `service-${tenantId.substring(0, 4)}-special-2`,
          name: 'Hair Extensions',
          description: 'Professional hair extension application',
          duration: 180,
          price: 200,
          category: 'Treatment',
          active: true,
          popular: false
        });
      }
      
      if (seed % 5 === 0) {
        mockServices.push({
          id: `service-${tenantId.substring(0, 4)}-special-3`,
          name: 'Color Correction',
          description: 'Fix and enhance previous color work',
          duration: 150,
          price: 120,
          category: 'Color',
          active: true,
          popular: false
        });
      }
      
      setServices(mockServices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };
  
  // Filter services based on search, category, and active status
  const filteredServices = services.filter(service => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    // Filter by active status
    const matchesActiveStatus = showInactiveServices || service.active;
    
    return matchesSearch && matchesCategory && matchesActiveStatus;
  });
  
  // Group services by category for display
  const groupedServices = filteredServices.reduce((groups, service) => {
    if (!groups[service.category]) {
      groups[service.category] = [];
    }
    groups[service.category].push(service);
    return groups;
  }, {} as Record<string, Service[]>);
  
  // Calculate total revenue potential
  const totalRevenuePotential = services
    .filter(service => service.active)
    .reduce((sum, service) => sum + service.price, 0);
  
  // Toggle service active status
  const toggleServiceStatus = (id: string) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === id 
          ? { ...service, active: !service.active } 
          : service
      )
    );
  };
  
  // Toggle service popular status
  const togglePopularStatus = (id: string) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === id 
          ? { ...service, popular: !service.popular } 
          : service
      )
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage {tenantInfo?.name}'s service offerings
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Service
            </button>
          </div>
        </div>
      </header>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search services..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category filter */}
            <div className="flex-shrink-0">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Show inactive toggle */}
            <div className="flex-shrink-0 flex items-center">
              <input
                id="show-inactive"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={showInactiveServices}
                onChange={() => setShowInactiveServices(!showInactiveServices)}
              />
              <label htmlFor="show-inactive" className="ml-2 block text-sm text-gray-700">
                Show inactive services
              </label>
            </div>
          </div>
        </div>
        
        {/* Stats summary */}
        <div className="border-b border-gray-200 bg-gray-50 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-gray-500">Total Services</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{services.length}</p>
          </div>
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-gray-500">Active Services</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {services.filter(s => s.active).length}
            </p>
          </div>
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-gray-500">Popular Services</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {services.filter(s => s.popular).length}
            </p>
          </div>
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-gray-500">Revenue Potential</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">£{totalRevenuePotential}</p>
          </div>
        </div>
        
        {filteredServices.length > 0 ? (
          <div className="p-4 md:p-6">
            {Object.keys(groupedServices).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedServices).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryServices.map(service => (
                        <div 
                          key={service.id} 
                          className={`border rounded-lg overflow-hidden ${
                            service.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-medium text-gray-900 flex items-center">
                                  {service.name}
                                  {service.popular && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Popular
                                    </span>
                                  )}
                                  {!service.active && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      Inactive
                                    </span>
                                  )}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">£{service.price}</p>
                                <p className="text-sm text-gray-500">{service.duration} min</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <button
                                onClick={() => setEditingService(service)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Edit
                              </button>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => togglePopularStatus(service.id)}
                                  className={`text-xs px-2 py-1 rounded ${
                                    service.popular
                                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  {service.popular ? 'Popular' : 'Set Popular'}
                                </button>
                                <button
                                  onClick={() => toggleServiceStatus(service.id)}
                                  className={`text-xs px-2 py-1 rounded ${
                                    service.active
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                >
                                  {service.active ? 'Active' : 'Inactive'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No services match your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first service'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              All services displayed are specific to your <strong>{tenantInfo?.name}</strong> account. 
              Each tenant maintains isolated service data for improved security and organization.
            </p>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Service Modal - In a real app, this would be a separate component */}
      {(isAddModalOpen || editingService) && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-gray-500">
                        This is a demo modal. In a real application, you would be able to add or edit services here.
                      </p>
                      <p className="text-sm text-gray-500">
                        The form would include fields for:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
                        <li>Service name</li>
                        <li>Description</li>
                        <li>Duration</li>
                        <li>Price</li>
                        <li>Category</li>
                        <li>Active status</li>
                        <li>Popular status</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingService(null);
                  }}
                >
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingService(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 