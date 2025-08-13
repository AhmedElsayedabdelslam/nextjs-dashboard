'use client';
import { useState, useEffect } from 'react';

export default function Profile() {
    useEffect(()=>{
      document.title='Mu Profile'
    })
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: ''
  });

  // Load data when page opens
  useEffect(() => {
    setFormData({
      name: localStorage.getItem('fullName') || '',
      age: localStorage.getItem('age') || '',
      email: localStorage.getItem('email') || '',
      password: '••••••••'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('fullName', formData.name);
    localStorage.setItem('age', formData.age);
    localStorage.setItem('email', formData.email);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-emerald-400/50 shadow-lg shadow-emerald-500/20 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {formData.name.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-text-fade">
            User Profile
          </h1>
        </div>

        {/* Profile Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-lg animate-fade-in">
          {/* Name Field */}
          <div className="mb-6 animate-field-enter" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Full Name
            </label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-white transition-all duration-200 hover:border-emerald-400/30"
              />
            ) : (
              <div className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 transition-all duration-200 hover:bg-slate-700/70">
                {formData.name}
              </div>
            )}
          </div>

          {/* Age Field */}
          <div className="mb-6 animate-field-enter" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
              Age
            </label>
            {editMode ? (
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-white transition-all duration-200 hover:border-emerald-400/30"
              />
            ) : (
              <div className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 transition-all duration-200 hover:bg-slate-700/70">
                {formData.age}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6 animate-field-enter" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              Email Address
            </label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-white transition-all duration-200 hover:border-emerald-400/30"
              />
            ) : (
              <div className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 transition-all duration-200 hover:bg-slate-700/70">
                {formData.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-8 animate-field-enter" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
              <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Password
            </label>
            <div className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-3 transition-all duration-200 hover:bg-slate-700/70">
              {formData.password}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 animate-field-enter" style={{ animationDelay: '0.5s' }}>
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes textFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fieldEnter {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-text-fade {
          animation: textFade 1s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-field-enter {
          animation: fieldEnter 0.6s ease-out forwards;
          opacity: 0;
        }
        
        /* Button hover effect */
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        .hover-scale:active {
          transform: scale(0.98);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
        
        /* Input focus effect */
        input:focus {
          box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.25);
        }
      `}</style>
    </div>
  );
}