'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Pricing from '@/components/Pricing';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <header className="fixed w-full bg-white bg-opacity-95 backdrop-blur-sm z-50 py-4 px-4 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Project Nano</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/project-plan" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Project Plan
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Log in
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors font-medium"
              aria-label="Get Started"
            >
              Get Started
            </Link>
          </nav>
          
          <div className="md:hidden flex items-center">
            <Link 
              href="/auth/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              aria-label="Get Started"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Appointment Management System
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Streamline bookings for any service-based business. Connect professionals with clients, boost retention, and grow your revenue with our customizable platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 px-8 rounded-lg transition-colors"
                    aria-label="Start 7-Day Free Trial"
                  >
                    Start 7-Day Free Trial
                  </Link>
                  <Link
                    href="#pricing"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-center font-bold py-4 px-8 rounded-lg transition-colors"
                    aria-label="View Pricing Options"
                  >
                    View Pricing
                  </Link>
                </div>
                <p className="text-gray-500 mt-4 text-sm">No credit card required for trial</p>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg blur opacity-20"></div>
                  <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/images/booking-dashboard.jpg"
                      alt="Project Nano Appointment Management Dashboard"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                      priority
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400/f8fafc/1e40af?text=Booking+Dashboard";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50 px-4" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="stats-heading" className="sr-only">Key Benefits of ProjectNano</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-5xl font-bold text-blue-600 mb-2">80%</h3>
                <p className="text-lg text-gray-800 font-medium">Of bookings become returning customers</p>
                <p className="text-gray-600 mt-4">Our system helps you build client loyalty across any industry</p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-5xl font-bold text-blue-600 mb-2">30%</h3>
                <p className="text-lg text-gray-800 font-medium">Growth in revenue on average</p>
                <p className="text-gray-600 mt-4">Businesses using our platform see measurable business growth</p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-5xl font-bold text-blue-600 mb-2">0</h3>
                <p className="text-lg text-gray-800 font-medium">No more no-shows</p>
                <p className="text-gray-600 mt-4">Automated reminders reduce missed appointments for any service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
              Adaptable to Your Business Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Image 
                      src="/icons/business-icon.png" 
                      alt="Business Owners"
                      width={80}
                      height={80}
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/80/dbeafe/1e40af?text=Owner";
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">For Business Owners</h3>
                <p className="text-gray-600 mb-6 text-center">Streamline operations, gain insights, and empower your service providers</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Staff management & scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Revenue analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Multi-location support</span>
                  </li>
                </ul>
                <Link href="/project-plan" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Image 
                      src="/icons/professional-icon.png" 
                      alt="Service Professionals"
                      width={80}
                      height={80}
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/80/dbeafe/1e40af?text=Pro";
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">For Service Professionals</h3>
                <p className="text-gray-600 mb-6 text-center">Take control of your schedule, client relationships, and payments</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Client management & history</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Personal calendar & scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">No-show protection</span>
                  </li>
                </ul>
                <Link href="/project-plan" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Image 
                      src="/icons/client-icon.png" 
                      alt="Clients"
                      width={80}
                      height={80}
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/80/dbeafe/1e40af?text=Client";
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">For Clients</h3>
                <p className="text-gray-600 mb-6 text-center">Offer the best booking experience to effortlessly build loyalty</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">24/7 online booking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">SMS & email reminders</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Preferred professional selection</span>
                  </li>
                </ul>
                <Link href="/project-plan" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Business Types Section */}
        <section className="py-16 bg-gray-50 px-4" aria-labelledby="business-types-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="business-types-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Perfect For Any Service Business
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Barber Shops</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Salons & Spas</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Healthcare</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Consultants</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Personal Trainers</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Education & Tutoring</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Legal Services</h3>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">And Many More!</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Image Showcase Section */}
        <section className="py-20 px-4" aria-labelledby="showcase-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="showcase-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Powerful Tools for Your Business
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="relative">
                <div className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Calendar</h3>
                  <Image
                    src="/calendar-view.jpg"
                    alt="Appointment Calendar"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/f8fafc/1e40af?text=Appointment+Calendar";
                    }}
                  />
                  <p className="text-gray-600 mt-4">Keep track of all appointments with our intuitive calendar interface</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Client Management</h3>
                  <Image
                    src="/client-management.jpg"
                    alt="Client Management"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/f8fafc/1e40af?text=Client+Management";
                    }}
                  />
                  <p className="text-gray-600 mt-4">Maintain client profiles, preferences, and appointment history</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Online Booking</h3>
                  <Image
                    src="/online-booking.jpg"
                    alt="Online Booking System"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/f8fafc/1e40af?text=Online+Booking";
                    }}
                  />
                  <p className="text-gray-600 mt-4">Let clients book appointments 24/7 through your custom booking page</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Business Analytics</h3>
                  <Image
                    src="/analytics-dashboard.jpg"
                    alt="Business Analytics Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/f8fafc/1e40af?text=Business+Analytics";
                    }}
                  />
                  <p className="text-gray-600 mt-4">Track revenue, appointments, and client retention with powerful analytics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-blue-50" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Elevate Your Business with Project Nano
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of service businesses using Project Nano to streamline bookings, reduce no-shows, and grow their client base.
            </p>
            <Link
              href="/auth/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
              aria-label="Start Your 7-Day Free Trial"
            >
              Start Your 7-Day Free Trial
            </Link>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 bg-white" aria-labelledby="pricing-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Choose the plan that works best for your business. All plans include a 7-day free trial. No credit card required.
            </p>
            
            <Pricing />
          </div>
        </section>

        {/* Testimonial Section (reused) */}
        <section id="testimonials" className="py-20 px-4 bg-gray-50" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
              Trusted by Businesses Everywhere
            </h2>
            <Testimonials />
          </div>
        </section>

        {/* FAQ Section (reused) */}
        <section className="py-20 px-4 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
              Frequently Asked Questions
            </h2>
            <FAQ />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-blue-50" aria-labelledby="final-cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="final-cta-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to transform your business?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of successful service providers already using Project Nano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
                aria-label="Start 7-Day Free Trial"
              >
                Start 7-Day Free Trial
              </Link>
              <Link
                href="/demo"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg transition-colors"
                aria-label="View Demo"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (reused) */}
      <Footer />
    </div>
  );
} 