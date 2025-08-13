"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../ui/header";

export default function Dashboard() {
    useEffect(()=>{
      document.title='Main Clinic'
    })
  const [isScrolled, setIsScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [statsWidths, setStatsWidths] = useState([]);

  useEffect(() => {
    document.title = "Dashboard | ClinicSystem+";
    setLoaded(true);
    
    // Generate consistent widths for stats bars
    setStatsWidths([70, 85, 45, 60]);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 300 && window.scrollY < sectionTop + sectionHeight - 300) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample data with consistent values
  const stats = [
    { title: "Total Patients", value: "1,248", change: "+12%", trend: "up" },
    { title: "Appointments", value: "86", change: "+5%", trend: "up" },
    { title: "Revenue", value: "$24,890", change: "+8.2%", trend: "up" },
    { title: "Pending Tasks", value: "9", change: "-3%", trend: "down" }
  ];

  const appointments = [
    { name: "Sarah Johnson", time: "09:30 AM", type: "Follow-up", status: "confirmed" },
    { name: "Michael Brown", time: "11:15 AM", type: "Consultation", status: "confirmed" },
    { name: "Emily Davis", time: "02:00 PM", type: "Check-up", status: "pending" },
    { name: "Robert Wilson", time: "03:45 PM", type: "Emergency", status: "confirmed" }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Simplified Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-cyan-900 opacity-10 blur-3xl"></div>
      </div>

      <Header scrolled={isScrolled} />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3 transition-all duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          {['overview', 'stats', 'appointments', 'reports', 'settings'].map((item) => (
            <button
              key={item}
              onClick={() => document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === item ? 'bg-cyan-400 ring-4 ring-cyan-400/30' : 'bg-slate-600 hover:bg-slate-500'}`}
              aria-label={`Go to ${item}`}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section id="overview" className="max-w-7xl mx-auto mb-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              ClinicSystem+ Dashboard
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Your comprehensive healthcare management platform
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-800/50 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
                <div className="w-56 h-56 md:w-72 md:h-72 bg-slate-800/70 rounded-full border border-cyan-400/20 flex items-center justify-center">
                  <svg className="w-40 h-40 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-cyan-400/90 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Welcome back, Doctor!
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="max-w-7xl mx-auto mb-32 scroll-mt-24">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Clinic Performance
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'
                  }`}>
                    {stat.change}
                    {stat.trend === 'up' ? (
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.trend === 'up' ? 'bg-emerald-400' : 'bg-rose-400'}`}
                      style={{ width: `${statsWidths[index]}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Appointments Section */}
        <section id="appointments" className="max-w-7xl mx-auto mb-32 scroll-mt-24">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Today's Appointments
            </span>
          </h2>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 p-4 bg-slate-800/70 text-slate-300 font-medium text-sm">
              <div>Patient</div>
              <div>Time</div>
              <div>Type</div>
              <div>Status</div>
            </div>
            
            {appointments.map((appointment, index) => (
              <div 
                key={index}
                className={`grid grid-cols-4 p-4 border-t border-slate-700/50 hover:bg-slate-800/70 transition-colors duration-300 ${
                  index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'
                }`}
              >
                <div className="text-white font-medium">{appointment.name}</div>
                <div className="text-slate-300">{appointment.time}</div>
                <div className="text-slate-300 capitalize">{appointment.type}</div>
                <div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-emerald-900/30 text-emerald-400' 
                      : 'bg-amber-900/30 text-amber-400'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reports Section */}
        <section id="reports" className="max-w-7xl mx-auto mb-32 scroll-mt-24">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Monthly Reports
            </span>
          </h2>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Interactive Charts</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Visualize your clinic's performance with beautiful charts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Section */}
        <section id="settings" className="max-w-7xl mx-auto scroll-mt-24">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Quick Settings
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Notifications', 'Theme', 'Working Hours', 'Staff Permissions', 'Billing', 'Integrations'].map((setting, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">{setting}</h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Configure your {setting.toLowerCase()} preferences.
                </p>
                <button className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center transition-colors duration-300">
                  Configure
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}