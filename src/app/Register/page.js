// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Register() {
//   const router = useRouter();

//   useEffect(() => {
//     document.title = "Register Page";
//   }, []);

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [age, setAge] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};

//     if (!fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//     } else if (fullName.length < 6) {
//       newErrors.fullName = "Full name must be at least 6 characters";
//     }

//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!age) {
//       newErrors.age = "Age is required";
//     } else if (Number(age) < 10) {
//       newErrors.age = "Age must be 10 or older";
//     }

//     if (!password) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = "Confirm password is required";
//     } else if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       localStorage.setItem("fullName", fullName);
//       localStorage.setItem("email", email);
//       localStorage.setItem("age", age);
//       localStorage.setItem("password", password);

//       alert("Registration successful ✅");

//       setFullName("");
//       setEmail("");
//       setAge("");
//       setPassword("");
//       setConfirmPassword("");
//       setErrors({});

//       router.push("/login"); // لازم المسار يبدأ بـ /
//     }
//   };

//   return (
//     <React.Fragment>
//       <input
//         type="text"
//         value={fullName}
//         placeholder="Full Name"
//         onChange={(e) => setFullName(e.target.value)}
//       />
//       {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}

//       <input
//         type="email"
//         value={email}
//         placeholder="Email Address"
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

//       <input
//         type="number"
//         value={age}
//         placeholder="Your Age"
//         onChange={(e) => setAge(e.target.value)}
//       />
//       {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}

//       <input
//         type="password"
//         value={password}
//         placeholder="Your Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

//       <input
//         type="password"
//         value={confirmPassword}
//         placeholder="Confirm Password"
//         onChange={(e) => setConfirmPassword(e.target.value)}
//       />
//       {errors.confirmPassword && (
//         <p style={{ color: "red" }}>{errors.confirmPassword}</p>
//       )}

//       <button onClick={handleSubmit}>Sign Up</button>
//     </React.Fragment>
//   );
// }






























"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ElegantRegister() {
    useEffect(()=>{
      document.title='TRegister'
    })
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = "Register";
    setIsLoaded(true);
  }, []);

  const validate = () => {
    const newErrors = {};
    const { fullName, email, age, password, confirmPassword } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    else if (fullName.length < 6) newErrors.fullName = "Must be at least 6 characters";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

    if (!age) newErrors.age = "Age is required";
    else if (Number(age) < 10) newErrors.age = "Must be 10 or older";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem("userData", JSON.stringify(formData));
      setShowSuccess(true);
      
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          age: "",
          password: "",
          confirmPassword: ""
        });
        setErrors({});
        setIsSubmitting(false);
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-md">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900 opacity-10 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-cyan-900 opacity-10 blur-3xl animate-float-slower"></div>
          <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-violet-900 opacity-10 blur-3xl animate-float"></div>
        </div>

        {/* Main Card */}
        <div className={`relative bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-slate-700/50 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Glowing Top Bar */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 animate-pulse-slow"></div>

          {/* Header */}
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2 animate-text-fade">
              Create Your Account
            </h1>
            <p className="text-slate-400 animate-text-fade-delay">
              Join our exclusive community today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {showSuccess && (
              <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-100 px-4 py-3 rounded-lg animate-success-message">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Registration successful! Redirecting...</span>
                </div>
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 transition-all duration-300">
                Full Name
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'fullName' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <input
                  name="fullName"
                  value={formData.fullName}
                  placeholder="John Doe"
                  onChange={handleChange}
                  onFocus={() => setActiveField('fullName')}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 bg-slate-800/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${errors.fullName ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-rose-400 text-sm animate-error-fade">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 transition-all duration-300">
                Email Address
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'email' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="john@example.com"
                  onChange={handleChange}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 bg-slate-800/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${errors.email ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'}`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-sm animate-error-fade">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 transition-all duration-300">
                Age
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'age' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <input
                  name="age"
                  type="number"
                  value={formData.age}
                  placeholder="25"
                  onChange={handleChange}
                  onFocus={() => setActiveField('age')}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 bg-slate-800/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${errors.age ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'}`}
                />
              </div>
              {errors.age && (
                <p className="text-rose-400 text-sm animate-error-fade">
                  {errors.age}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 transition-all duration-300">
                Password
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'password' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 bg-slate-800/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${errors.password ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'}`}
                />
              </div>
              {errors.password && (
                <p className="text-rose-400 text-sm animate-error-fade">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 transition-all duration-300">
                Confirm Password
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${activeField === 'confirmPassword' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  placeholder="••••••••"
                  onChange={handleChange}
                  onFocus={() => setActiveField('confirmPassword')}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 bg-slate-800/70 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all duration-300 ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-sm animate-error-fade">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-500 ${isSubmitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg hover:shadow-cyan-500/20'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="loading-spinner mr-3"></span>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Register Now
                </span>
              )}
            </button>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes text-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes error-fade {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes success-message {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 16s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-text-fade {
          animation: text-fade 0.8s ease-out forwards;
        }
        .animate-text-fade-delay {
          animation: text-fade 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-error-fade {
          animation: error-fade 0.3s ease-out forwards;
        }
        .animate-success-message {
          animation: success-message 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .loading-spinner {
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}