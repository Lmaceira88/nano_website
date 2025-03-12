"use client";

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  ScissorsIcon, 
  UserGroupIcon, 
  CogIcon, 
  SupportIcon, 
  BellIcon, 
  XIcon, 
  MenuIcon,
  getPageTitle
} from '@/components/common/Icons';

// Dashboard layout for tenant applications
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();

  // Load tenant info from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTenantInfo = localStorage.getItem('tenantInfo');
      const storedUser = localStorage.getItem('user');
      
      if (storedTenantInfo) {
        setTenantInfo(JSON.parse(storedTenantInfo));
      }
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Simulated notifications
      setNotifications([
        { id: 1, message: 'New appointment request from John Smith', time: '10 minutes ago', read: false },
        { id: 2, message: 'Invoice #1234 has been paid', time: '2 hours ago', read: false },
        { id: 3, message: 'Staff meeting scheduled for tomorrow', time: '1 day ago', read: true }
      ]);
    }
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: HomeIcon, current: pathname === '/app' },
    { name: 'Appointments', href: '/app/appointments', icon: CalendarIcon, current: pathname.startsWith('/app/appointments') },
    { name: 'Clients', href: '/app/clients', icon: UsersIcon, current: pathname.startsWith('/app/clients') },
    { name: 'Services', href: '/app/services', icon: ScissorsIcon, current: pathname.startsWith('/app/services') },
    { name: 'Staff', href: '/app/staff', icon: UserGroupIcon, current: pathname.startsWith('/app/staff') },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/app/settings', icon: CogIcon, current: pathname.startsWith('/app/settings') },
    { name: 'Help & Support', href: '/app/support', icon: SupportIcon, current: pathname.startsWith('/app/support') },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close button */}
        <div className="absolute right-0 top-0 pt-4 -mr-12 md:hidden">
          <button 
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <XIcon className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Sidebar header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-gray-900 font-medium text-lg">ProjectNano</span>
          </div>
        </div>

        {/* Tenant information */}
        {tenantInfo && (
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                {tenantInfo.name ? tenantInfo.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {tenantInfo.name || 'Your Business'}
                </p>
                <p className="text-xs text-gray-500">
                  {tenantInfo.id ? `Tenant ID: ${tenantInfo.id.substring(0, 8)}...` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 py-4 space-y-1 px-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </p>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                  }`} 
                />
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                System
              </p>
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} 
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* User profile */}
        {user && (
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {user.firstName && user.lastName ? 
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName && user.lastName ? 
                    `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <button 
                  className="text-xs text-gray-500 hover:text-blue-600 truncate"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('projectnano_token');
                      localStorage.removeItem('user');
                      localStorage.removeItem('tenantInfo');
                      window.location.href = '/auth/login';
                    }
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Left: Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Left (Desktop): Page title */}
            <div className="hidden md:flex md:items-center">
              <h1 className="text-lg font-medium text-gray-900">
                {getPageTitle(pathname)}
              </h1>
            </div>
            
            {/* Center: Mobile title */}
            <div className="md:hidden flex-1 flex justify-center">
              <h1 className="text-lg font-medium text-gray-900 truncate">
                {getPageTitle(pathname)}
              </h1>
            </div>
            
            {/* Right: User actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="flex items-center justify-center p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <Suspense fallback={<div className="animate-pulse p-4 bg-white rounded-lg shadow">Loading page content...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
} 