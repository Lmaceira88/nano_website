"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTenant } from '@/contexts/TenantContext';
import SearchParamsProvider from '@/components/common/SearchParamsProvider';

interface Appointment {
  id: string;
  clientName: string;
  clientId: string;
  serviceName: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  price: number;
}

export default function AppointmentsPage() {
  return (
    <SearchParamsProvider>
      <AppointmentsContent />
    </SearchParamsProvider>
  );
}

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const { tenantId, tenantInfo } = useTenant();
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  useEffect(() => {
    if (tenantId) {
      fetchAppointments(tenantId);
    }
  }, [tenantId]);
  
  const fetchAppointments = async (tenantId: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock appointments based on tenant ID for demo
      const mockAppointments: Appointment[] = [];
      
      // Create deterministic but tenant-specific appointments
      const seed = tenantId.charCodeAt(0) + tenantId.charCodeAt(tenantId.length - 1);
      const appointmentCount = 30 + (seed % 20);
      
      const clientNames = [
        'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Johnson', 
        'David Williams', 'Jennifer Davis', 'Robert Miller', 'Amanda Jones',
        'Daniel Taylor', 'Sophia Anderson', 'Matthew Thomas', 'Olivia Jackson'
      ];
      
      const services = [
        { name: 'Haircut & Style', price: 45 },
        { name: 'Beard Trim', price: 25 },
        { name: 'Hair Coloring', price: 85 },
        { name: 'Shave', price: 35 },
        { name: 'Facial Treatment', price: 65 },
        { name: 'Hair Consultation', price: 20 },
        { name: 'Hair & Beard Combo', price: 60 },
        { name: 'Express Cut', price: 30 }
      ];
      
      const statuses = ['confirmed', 'pending', 'cancelled', 'completed'];
      
      // Get current date
      const today = new Date();
      
      // Create appointments spanning from 2 weeks ago to 4 weeks in the future
      for (let i = 0; i < appointmentCount; i++) {
        // Create date between -14 and +28 days from today
        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() - 14 + Math.floor(Math.random() * 42));
        
        // Create time between 9 AM and 5 PM
        const hours = 9 + Math.floor(Math.random() * 8);
        const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        
        // Format as strings
        const dateStr = appointmentDate.toISOString().split('T')[0];
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Select a client and service
        const clientName = clientNames[Math.floor((seed + i) % clientNames.length)];
        const service = services[Math.floor((seed * i) % services.length)];
        
        // Determine status based on date (past appointments are completed, future are confirmed or pending)
        let status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
        if (appointmentDate < today) {
          // Past appointments: 80% completed, 20% cancelled
          status = Math.random() < 0.8 ? 'completed' : 'cancelled';
        } else {
          // Future appointments: 70% confirmed, 30% pending
          status = Math.random() < 0.7 ? 'confirmed' : 'pending';
        }
        
        // Create duration between 30 and 120 minutes
        const duration = [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)];
        
        // Maybe add notes (30% chance)
        const notes = Math.random() < 0.3 
          ? `Client ${Math.random() < 0.5 ? 'prefers' : 'requested'} ${Math.random() < 0.5 ? 'specific products' : 'extra time'}.`
          : undefined;
        
        mockAppointments.push({
          id: `appt-${tenantId.substring(0, 4)}-${i}`,
          clientName,
          clientId: `client-${clientNames.indexOf(clientName)}`,
          serviceName: service.name,
          serviceId: `service-${services.indexOf(service)}`,
          date: dateStr,
          time: timeStr,
          duration,
          status: status as any,
          notes,
          price: service.price
        });
      }
      
      // Sort appointments by date and time
      mockAppointments.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });
      
      setAppointments(mockAppointments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };
  
  // Filter appointments based on current filters
  const filteredAppointments = appointments.filter(appointment => {
    // Status filter
    if (statusFilter !== 'all' && appointment.status !== statusFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') {
        const todayStr = today.toISOString().split('T')[0];
        if (appointment.date !== todayStr) {
          return false;
        }
      } else if (dateFilter === 'week') {
        // Get dates for the next 7 days
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        if (appointmentDate < today || appointmentDate > nextWeek) {
          return false;
        }
      } else if (dateFilter === 'month') {
        // Get dates for the next 30 days
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        
        if (appointmentDate < today || appointmentDate > nextMonth) {
          return false;
        }
      }
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.clientName.toLowerCase().includes(query) ||
        appointment.serviceName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Group appointments by date for calendar view
  const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
    if (!groups[appointment.date]) {
      groups[appointment.date] = [];
    }
    groups[appointment.date].push(appointment);
    return groups;
  }, {} as Record<string, Appointment[]>);
  
  // Generate dates for calendar view
  const getCalendarDays = () => {
    const days = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - selectedDate.getDay()); // Start from Sunday
    
    // Generate 7 days (a week)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    
    return days;
  };
  
  const calendarDays = getCalendarDays();
  
  // Calculate revenue from appointments
  const totalRevenue = filteredAppointments
    .filter(appointment => appointment.status === 'completed')
    .reduce((sum, appointment) => sum + appointment.price, 0);
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    return `${hourNum % 12 || 12}:${minutes} ${hourNum >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Navigation for calendar view
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage {tenantInfo?.name}'s appointments and bookings
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/app/appointments/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Appointment
            </Link>
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
                placeholder="Search appointments..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* View type toggle */}
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                  viewType === 'list' 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 z-10' 
                    : 'bg-white border-gray-300 text-gray-700'
                } text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => setViewType('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                  viewType === 'calendar' 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 z-10' 
                    : 'bg-white border-gray-300 text-gray-700'
                } text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => setViewType('calendar')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </button>
            </div>
            
            {/* Date filter */}
            <div className="flex-shrink-0">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
              >
                <option value="today">Today</option>
                <option value="week">Next 7 days</option>
                <option value="month">Next 30 days</option>
                <option value="all">All appointments</option>
              </select>
            </div>
            
            {/* Status filter */}
            <div className="flex-shrink-0">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredAppointments.length > 0 ? (
          <>
            {/* Stats summary */}
            <div className="border-b border-gray-200 bg-gray-50 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
              <div className="px-6 py-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{filteredAppointments.length}</p>
              </div>
              <div className="px-6 py-3">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {filteredAppointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <div className="px-6 py-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {filteredAppointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <div className="px-6 py-3">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">£{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            
            {/* List view */}
            {viewType === 'list' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{appointment.clientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{appointment.serviceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="text-sm text-gray-500">{formatTime(appointment.time)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.duration} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          £{appointment.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/app/appointments/${appointment.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          {appointment.status === 'pending' && (
                            <button className="ml-3 text-green-600 hover:text-green-900">
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Calendar view */}
            {viewType === 'calendar' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => navigateCalendar('prev')}
                    className="px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-base font-medium text-gray-900">
                    {selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button 
                    onClick={() => navigateCalendar('next')}
                    className="px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="bg-white">
                      <div className={`px-2 py-2 text-center border-b ${
                        day.toDateString() === new Date().toDateString() 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'border-gray-100'
                      }`}>
                        <p className="text-sm font-medium">
                          {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                        </p>
                        <p className={`text-2xl ${
                          day.toDateString() === new Date().toDateString() 
                            ? 'text-blue-600 font-bold' 
                            : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </p>
                      </div>
                      <div className="h-72 overflow-y-auto px-1 py-1">
                        {groupedAppointments[day.toISOString().split('T')[0]]?.map((appointment) => (
                          <Link 
                            key={appointment.id}
                            href={`/app/appointments/${appointment.id}`}
                            className={`block p-2 mb-1 rounded text-xs ${
                              getStatusBadgeClass(appointment.status)
                            } hover:opacity-90 transition-opacity`}
                          >
                            <div className="font-medium truncate">{appointment.clientName}</div>
                            <div className="flex justify-between">
                              <span>{formatTime(appointment.time)}</span>
                              <span>{appointment.duration}m</span>
                            </div>
                            <div className="truncate">{appointment.serviceName}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first appointment'}
            </p>
            {!searchQuery && statusFilter === 'all' && dateFilter === 'all' && (
              <div className="mt-6">
                <Link
                  href="/app/appointments/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Appointment
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 