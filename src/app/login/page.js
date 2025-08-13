// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const router = useRouter();

//   useEffect(() => {
//     document.title = "Login";
//   }, []);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   function home() {
//     const getEmail = localStorage.getItem("email");
//     const getPassword = localStorage.getItem("password");

//     if (getEmail === email && getPassword === password) {
//       alert("Login Success");
//       router.push("/Dashboard"); // لازم تكتب المسار صح
//     } else {
//       alert("Check your email and password");
//     }
//   }

//   return (
//     <React.Fragment>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={home}>Sign In</button>
//     </React.Fragment>
//   );
// }





















































"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function ElegantLogin() {
    useEffect(()=>{
      document.title='Login'
    })
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = "Login | Premium Dashboard";
    setIsLoaded(true);
  }, []);

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

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
      await new Promise(resolve => setTimeout(resolve, 1000));

      const storedEmail = localStorage.getItem("email");
      const storedPassword = localStorage.getItem("password");

      if (storedEmail === formData.email && storedPassword === formData.password) {
        setShowSuccess(true);

        // 1. تغيير طريقة حفظ الكوكي لضمان العمل على جميع المتصفحات
        const cookieValue = `token=jkhfkalkjladjflljppjahgagjcpokopjpidocjpjicidjiochdicngaiycugoafllcc`;
        const cookieSettings = `path=/; max-age=3600; secure; samesite=lax`;
        document.cookie = `${cookieValue}; ${cookieSettings}`;

        // 2. إضافة تأخير للتأكد من تسجيل الكوكي
        setTimeout(() => {
          // 3. طريقة أفضل للتحقق من وجود الكوكي
          const cookieExists = document.cookie.split(';').some(cookie => {
            return cookie.trim().startsWith('token=');
          });

          if (cookieExists) {
            // 4. إضافة forceRefresh للتأكد من تحديث الصفحة
            window.location.href = "/Dashboard";
          } else {
            console.error('Failed to set cookie - Cookies:', document.cookie);
            setIsSubmitting(false);
            setErrors({ auth: "حدث خطأ تقني، يرجى المحاولة مرة أخرى" });
          }
        }, 300); // تأخير 300 مللي ثانية
      }
      else {
        setErrors({ auth: "Invalid email or password" });
        setIsSubmitting(false);
      }
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
              Welcome Back
            </h1>
            <p className="text-slate-400 animate-text-fade-delay">
              Sign in to your account
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
                  <span>Login successful! Redirecting...</span>
                </div>
              </div>
            )}

            {errors.auth && (
              <div className="bg-rose-900/50 border border-rose-700 text-rose-100 px-4 py-3 rounded-lg animate-error-fade">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errors.auth}</span>
                </div>
              </div>
            )}

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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-slate-700 rounded bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                >
                  Forgot password?
                </button>
              </div>
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
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              )}
            </button>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push("/Register")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300"
                >
                  Sign up
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