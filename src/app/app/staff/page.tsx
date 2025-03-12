"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/contexts/TenantContext';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  specialities: string[];
  status: 'active' | 'inactive';
  hireDate: string;
  scheduleHours: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  avatar?: string;
}

export default function StaffPage() {
  const { tenantId, tenantInfo } = useTenant();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  
  useEffect(() => {
    if (tenantId) {
      fetchStaff(tenantId);
    }
  }, [tenantId]);
  
  const fetchStaff = async (tenantId: string) => {
    setLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock staff based on tenant
      const mockStaff: StaffMember[] = [];
      const firstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Amanda', 'James', 'Jessica'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
      const positions = ['Stylist', 'Barber', 'Colorist', 'Receptionist', 'Manager', 'Assistant', 'Apprentice'];
      const specialities = ['Haircuts', 'Coloring', 'Styling', 'Beard Trim', 'Shaving', 'Hair Treatment', 'Extensions', 'Bridal'];
      
      // Use tenant ID to create deterministic but tenant-specific staff
      const seed = tenantId.charCodeAt(0) + tenantId.charCodeAt(tenantId.length - 1);
      const staffCount = 5 + (seed % 7); // 5-11 staff members
      
      for (let i = 0; i < staffCount; i++) {
        const firstName = firstNames[Math.floor((seed + i) % firstNames.length)];
        const lastName = lastNames[Math.floor((seed * i) % lastNames.length)];
        const position = positions[Math.floor((seed + i * 3) % positions.length)];
        
        // Create random specialties (2-4)
        const staffSpecialities: string[] = [];
        const specialtyCount = 2 + Math.floor(Math.random() * 3);
        for (let s = 0; s < specialtyCount; s++) {
          const specialty = specialities[Math.floor((seed + i + s) % specialities.length)];
          if (!staffSpecialities.includes(specialty)) {
            staffSpecialities.push(specialty);
          }
        }
        
        // Create random hire date (between 1 and 5 years ago)
        const hireDate = new Date();
        hireDate.setFullYear(hireDate.getFullYear() - (Math.floor(Math.random() * 5) + 1));
        hireDate.setMonth(Math.floor(Math.random() * 12));
        hireDate.setDate(Math.floor(Math.random() * 28) + 1);
        
        // Random schedule (most staff work 5 days)
        const scheduleHours: any = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        };
        
        const workDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        if (Math.random() > 0.5) workDays.push('saturday');
        if (Math.random() > 0.8) workDays.push('sunday');
        
        // Remove 1-2 random weekdays for part-time staff
        if (position !== 'Manager' && Math.random() > 0.6) {
          const daysOff = 1 + Math.floor(Math.random() * 2);
          for (let d = 0; d < daysOff; d++) {
            if (workDays.length > 3) { // Ensure at least 3 working days
              const randomIndex = Math.floor(Math.random() * (workDays.length - 2)) + 1; // Don't remove Monday or Friday
              workDays.splice(randomIndex, 1);
            }
          }
        }
        
        // Set working hours for each work day
        workDays.forEach(day => {
          const startHour = 8 + Math.floor(Math.random() * 2); // 8 or 9 AM
          const endHour = 17 + Math.floor(Math.random() * 3); // 5, 6, or 7 PM
          scheduleHours[day] = [`${startHour}:00`, `${endHour}:00`];
        });
        
        // Random status (mostly active)
        const status = Math.random() > 0.15 ? 'active' : 'inactive';
        
        mockStaff.push({
          id: `staff-${tenantId.substring(0, 4)}-${i}`,
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${tenantInfo?.name.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: `07${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
          position,
          specialities: staffSpecialities,
          status,
          hireDate: hireDate.toISOString().split('T')[0],
          scheduleHours
        });
      }
      
      setStaff(mockStaff);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setLoading(false);
    }
  };
  
  // Get unique positions for filter dropdown
  const positions = Array.from(new Set(staff.map(s => s.position)));
  
  // Filter staff
  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = searchQuery === '' || 
      staffMember.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.position.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === 'all' || staffMember.status === selectedStatus;
    const matchesPosition = selectedPosition === 'all' || staffMember.position === selectedPosition;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });
  
  // Format working days to display
  const formatSchedule = (schedule: StaffMember['scheduleHours']) => {
    const workingDays = Object.entries(schedule)
      .filter(([_, hours]) => hours.length > 0)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1, 3));
    
    return workingDays.join(', ');
  };
  
  const getAvailabilityStatus = (staffMember: StaffMember) => {
    // Check if staff member works today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const worksToday = staffMember.scheduleHours[today as keyof typeof staffMember.scheduleHours].length > 0;
    
    if (!worksToday) return 'not-working';
    
    // Check if staff is currently working (between start and end hours)
    if (staffMember.status === 'active' && worksToday) {
      const hours = staffMember.scheduleHours[today as keyof typeof staffMember.scheduleHours];
      const now = new Date();
      const currentHour = now.getHours();
      
      const startHour = parseInt(hours[0].split(':')[0]);
      const endHour = parseInt(hours[1].split(':')[0]);
      
      if (currentHour >= startHour && currentHour < endHour) {
        return 'available';
      } else if (currentHour < startHour) {
        return 'upcoming';
      }
    }
    
    return 'unavailable';
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
            <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your {tenantInfo?.name}'s team members
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/app/staff/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Staff Member
            </Link>
          </div>
        </div>
      </header>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search staff members..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0 flex space-x-4">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="all">All Positions</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredStaff.map(staffMember => {
              const availabilityStatus = getAvailabilityStatus(staffMember);
              return (
                <div key={staffMember.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {staffMember.firstName[0]}{staffMember.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {staffMember.firstName} {staffMember.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{staffMember.position}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staffMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staffMember.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Email: </span>
                        <span className="text-gray-700">{staffMember.email}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Phone: </span>
                        <span className="text-gray-700">{staffMember.phone}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Schedule: </span>
                        <span className="text-gray-700">{formatSchedule(staffMember.scheduleHours)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Specialities: </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {staffMember.specialities.map(specialty => (
                            <span key={specialty} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                          availabilityStatus === 'available' ? 'bg-green-500' :
                          availabilityStatus === 'upcoming' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="text-sm text-gray-600">
                          {availabilityStatus === 'available' ? 'Available now' :
                           availabilityStatus === 'upcoming' ? 'Starts later today' :
                           availabilityStatus === 'not-working' ? 'Not working today' :
                           'Unavailable'}
                        </span>
                      </div>
                      <Link
                        href={`/app/staff/${staffMember.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedStatus !== 'all' || selectedPosition !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first staff member'}
            </p>
            {!searchQuery && selectedStatus === 'all' && selectedPosition === 'all' && (
              <div className="mt-6">
                <Link
                  href="/app/staff/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Staff Member
                </Link>
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
              All staff displayed are specific to your <strong>{tenantInfo?.name}</strong> tenant. 
              Staff schedules, specialities, and availability are isolated from other tenants for data security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 