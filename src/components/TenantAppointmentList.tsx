'use client';

import React, { useState, useEffect } from 'react';
import { useTenant, useTenantQuery } from '@/hooks/useTenant';
import { SupabaseClient } from '@supabase/supabase-js';

interface Appointment {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  client_first_name: string;
  client_last_name: string;
  status: string;
  services: {
    id: string;
    name: string;
  }[];
  professionals: {
    id: string;
    name: string;
  }[];
}

export default function TenantAppointmentList() {
  const { tenant, supabase, loading: tenantLoading, error: tenantError } = useTenant();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch appointments
  const fetchAppointments = async (client: SupabaseClient, selectedDate: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await client
        .from('appointments')
        .select(`
          id,
          date,
          start_time,
          end_time,
          client_first_name,
          client_last_name,
          status,
          services:service_id (
            id,
            name
          ),
          professionals:professional_id (
            id,
            name
          )
        `)
        .eq('date', selectedDate)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments when tenant or date changes
  useEffect(() => {
    if (supabase && date) {
      fetchAppointments(supabase, date);
    }
  }, [supabase, date]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  if (tenantLoading) {
    return <div className="p-4 text-center">Loading tenant information...</div>;
  }

  if (tenantError) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading tenant: {tenantError}
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-4 text-center">
        No tenant context found. Please select a tenant.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Appointments for {tenant.name}
        </h2>
        <div>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading appointments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No appointments found for this date.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professional
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.client_first_name} {appointment.client_last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.services?.map(service => service.name).join(', ') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.professionals?.map(professional => professional.name).join(', ') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Helper function to format time (HH:MM:SS -> HH:MM AM/PM)
function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
} 