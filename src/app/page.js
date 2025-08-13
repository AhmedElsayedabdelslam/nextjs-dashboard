"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function MedicalLanding() {
  useEffect(()=>{
    document.title='Ai Clinic'
  })
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const floatingIconsRef = useRef([]);
  const featuresRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastScrollY = useRef(0);

  // Premium medical illustrations
  const bgImages = [
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", // AI Diagnosis
  "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80", // Medical Team
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"  // Health Tech
];
  // Floating medical icons
  const floatingIcons = [
    { icon: "❤️", top: 15, left: 10, speed: 0.5 },
    { icon: "🩺", top: 25, left: 85, speed: 0.7 },
    { icon: "🧪", top: 40, left: 15, speed: 0.6 },
    { icon: "🧫", top: 60, left: 80, speed: 0.8 },
    { icon: "💉", top: 75, left: 20, speed: 0.9 },
    { icon: "🦠", top: 85, left: 75, speed: 0.4 }
  ];

  // Custom easing function
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Custom animation handler
  const animateElements = () => {
    const now = Date.now();
    floatingIconsRef.current.forEach((el, i) => {
      if (el) {
        const { speed } = floatingIcons[i];
        const yOffset = Math.sin((now * 0.001 * speed) % (Math.PI * 2)) * 20;
        const rotation = Math.sin((now * 0.001 * speed * 0.5) % (Math.PI * 2)) * 5;
        el.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;
      }
    });
    animationFrameRef.current = requestAnimationFrame(animateElements);
  };

  useEffect(() => {
    document.title = "MediScan AI | Advanced Medical Diagnosis";
    setIsLoaded(true);
    
    // Start custom animations
    animationFrameRef.current = requestAnimationFrame(animateElements);

    // Feature rotation
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % bgImages.length);
    }, 5000);

    // Parallax effect
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;
      
      if (featuresRef.current) {
        const speed = 0.3;
        const offset = scrollDiff * speed;
        featuresRef.current.style.transform = `translateY(${offset}px)`;
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      clearInterval(featureInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Custom transition for feature slides
  const getFeatureTransition = (index) => {
    return {
      entering: { opacity: 0, transform: 'scale(0.95)' },
      entered: { opacity: 1, transform: 'scale(1)' },
      exiting: { opacity: 0, transform: 'scale(1.05)' }
    }[index === activeFeature ? 'entered' : 'exiting'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, i) => (
          <div
            key={i}
            ref={el => floatingIconsRef.current[i] = el}
            className="absolute text-4xl opacity-10"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Hero section */}
        <section className="text-center mb-28 pt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span 
              className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% auto',
                animation: 'gradientShift 8s ease infinite'
              }}
            >
              Revolutionizing
            </span> Medical Diagnosis
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Using cutting-edge AI to provide accurate health assessments and treatment recommendations in seconds
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/Register")}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
              }}
            >
              Get Started Free
            </button>
          </div>
        </section>

        {/* Feature showcase */}
        <section className="mb-28" ref={featuresRef}>
          <div className="relative h-96 md:h-[32rem] overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 shadow-xl">
            {bgImages.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-1000 ${activeFeature === i ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  ...getFeatureTransition(i)
                }}
              />
            ))}
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
              <div className="max-w-2xl">
                <span 
                  className="text-5xl mb-4 block"
                  style={{
                    display: 'inline-block',
                    animation: activeFeature === 0 ? 'bounce 2s infinite' : 'none'
                  }}
                >
                  {["🧠", "💊", "👨‍⚕️"][activeFeature]}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {["AI-Powered Diagnosis", "Instant Treatment Plans", "24/7 Doctor Support"][activeFeature]}
                </h2>
                <p className="text-lg md:text-xl text-slate-300">
                  {[
                    "Our advanced algorithms analyze symptoms with 95% accuracy",
                    "Personalized recommendations based on your condition",
                    "Connect with medical professionals anytime"
                  ][activeFeature]}
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === i ? 'bg-cyan-400 w-6' : 'bg-slate-600 hover:bg-slate-500'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-28">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            How MediScan AI Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "1",
                title: "Describe Your Symptoms",
                description: "Tell us what you're experiencing in simple terms",
                icon: "✍️",
                color: "from-cyan-500 to-cyan-600"
              },
              {
                step: "2",
                title: "AI Analysis", 
                description: "Our system compares against millions of medical cases",
                icon: "🤖",
                color: "from-purple-500 to-indigo-600"
              },
              {
                step: "3",
                title: "Get Recommendations",
                description: "Receive personalized treatment options",
                icon: "📋",
                color: "from-emerald-500 to-teal-600"
              }
            ].map((item, i) => (
              <div 
                key={i}
                className={`bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-slate-700/50 transition-all duration-300 ${hoveredCard === i ? 'border-cyan-500/50 -translate-y-2 shadow-lg shadow-cyan-500/10' : ''}`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === i ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCard === i ? '0 10px 25px rgba(6, 182, 212, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl mb-6 mx-auto`}
                  style={{
                    transform: hoveredCard === i ? 'rotate(15deg) scale(1.1)' : 'rotate(0) scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                  }}
                >
                  {item.icon}
                </div>
                <div className="text-cyan-400 font-bold mb-2 text-center">
                  STEP {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-28">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Trusted by Medical Professionals
          </h2>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
              <div>
                <div className="text-5xl mb-4 text-cyan-400">"</div>
                <p className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                  MediScan AI has revolutionized how we approach preliminary diagnoses in our clinic, saving us countless hours while maintaining exceptional accuracy.
                </p>
                <div className="font-bold text-white text-lg">
                  Dr. Sarah Johnson
                </div>
                <div className="text-slate-400">
                  Chief Medical Officer, Boston General
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border-2 border-cyan-500/30 mt-6 md:mt-0">
                <div 
                  className="absolute inset-0 bg-[url('/doctor-review.jpg')] bg-cover bg-center"
                  style={{
                    animation: 'zoomPan 20s ease-in-out infinite alternate'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="text-center py-16 md:py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
              animation: 'pulse 8s ease infinite'
            }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 px-4 relative">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 px-4 relative">
            Join thousands of users who've transformed their health journey with our AI-powered platform.
          </p>
          <button
            onClick={() => router.push("/Register")}
            className="px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg md:text-xl relative"
            style={{
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
            }}
          >
            Get Started Now - It's Free
          </button>
        </section>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes zoomPan {
          0% { transform: scale(1) translateX(0) translateY(0); }
          100% { transform: scale(1.1) translateX(-5%) translateY(-5%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
        
        /* Selection styles */
        ::selection {
          background: rgba(6, 182, 212, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}