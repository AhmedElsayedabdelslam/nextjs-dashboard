"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [currentTime, setCurrentTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll effect
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    // Live clock
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "diagnosis", label: "AI Diagnosis", path: "/diagnosis" },
    { id: "medicines", label: "Medicines", path: "/medicines" },
    { id: "hospitals", label: "Hospitals", path: "/hospitals" },
    { id: "profile", label: "Profile", path: "/profile" }
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-900/90 backdrop-blur-md py-2 md:py-3 shadow-xl"
            : "bg-slate-900/50 backdrop-blur-sm py-3 md:py-4"
        }`}
        style={{ animation: "slideDown 0.5s ease-out forwards" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-3 text-slate-300 hover:text-cyan-400 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Logo */}
            <div 
              onClick={() => router.push("/")}
              className="cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm md:text-base">CS</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                ClinicSystem<span className="text-cyan-400">+</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    setActiveLink(item.id);
                    router.push(item.path);
                  }}
                  className={`px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${
                    activeLink === item.id
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className={`absolute left-0 right-0 h-0.5 bg-cyan-400 bottom-0 transition-all duration-300 ${
                    activeLink === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`} />
                </button>
              </div>
            ))}
          </nav>

          {/* Right side elements */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Live clock - hidden on small screens */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300">
                {currentTime}
              </span>
            </div>
            
            {/* Notification bell */}
            <button className="p-1 md:p-2 text-slate-300 hover:text-cyan-400 transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User avatar */}
            <button 
              onClick={() => router.push("/profile")}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:ring-2 hover:ring-cyan-400 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-slate-900/95 backdrop-blur-lg z-40 pt-16 transform transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="px-6 py-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveLink(item.id);
                  setMobileMenuOpen(false);
                  router.push(item.path);
                }}
                className={`px-4 py-3 text-left text-lg font-medium transition-colors rounded-lg ${
                  activeLink === item.id
                    ? "bg-slate-800 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile time display */}
          <div className="mt-8 flex items-center space-x-2 px-4 py-3 text-slate-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
