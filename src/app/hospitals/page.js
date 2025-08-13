'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function HospitalsPage() {
    useEffect(()=>{
      document.title='Hospitals'
    })
  const [governorate, setGovernorate] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [language, setLanguage] = useState('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const router = useRouter();

  // Governorates in Egypt with coordinates
  const governorates = [
    { name: { en: 'Cairo', ar: 'القاهرة' }, lat: 30.0444, lng: 31.2357 },
    { name: { en: 'Alexandria', ar: 'الإسكندرية' }, lat: 31.2001, lng: 29.9187 },
    { name: { en: 'Giza', ar: 'الجيزة' }, lat: 29.9870, lng: 31.2118 },
    { name: { en: 'Sharqia', ar: 'الشرقية' }, lat: 30.7326, lng: 31.7157 },
    { name: { en: 'Dakahlia', ar: 'الدقهلية' }, lat: 31.0409, lng: 31.3785 },
    { name: { en: 'Beheira', ar: 'البحيرة' }, lat: 30.8481, lng: 30.3435 },
    { name: { en: 'Qalyubia', ar: 'القليوبية' }, lat: 30.4255, lng: 31.2044 },
    { name: { en: 'Minya', ar: 'المنيا' }, lat: 28.1099, lng: 30.7503 },
    { name: { en: 'Asyut', ar: 'أسيوط' }, lat: 27.1783, lng: 31.1859 },
    { name: { en: 'Sohag', ar: 'سوهاج' }, lat: 26.5569, lng: 31.6948 },
    { name: { en: 'Luxor', ar: 'الأقصر' }, lat: 25.6872, lng: 32.6396 },
    { name: { en: 'Aswan', ar: 'أسوان' }, lat: 24.0908, lng: 32.8994 },
    { name: { en: 'Red Sea', ar: 'البحر الأحمر' }, lat: 25.5403, lng: 34.6416 },
    { name: { en: 'New Valley', ar: 'الوادي الجديد' }, lat: 24.5456, lng: 27.1715 },
    { name: { en: 'Matrouh', ar: 'مطروح' }, lat: 29.5696, lng: 27.1594 },
    { name: { en: 'North Sinai', ar: 'شمال سيناء' }, lat: 30.5667, lng: 33.6833 },
    { name: { en: 'South Sinai', ar: 'جنوب سيناء' }, lat: 28.3835, lng: 34.3599 },
    { name: { en: 'Port Said', ar: 'بورسعيد' }, lat: 31.2565, lng: 32.2841 },
    { name: { en: 'Ismailia', ar: 'الإسماعيلية' }, lat: 30.6043, lng: 32.2723 },
    { name: { en: 'Suez', ar: 'السويس' }, lat: 29.9668, lng: 32.5498 },
    { name: { en: 'Gharbia', ar: 'الغربية' }, lat: 30.8754, lng: 31.0335 },
    { name: { en: 'Monufia', ar: 'المنوفية' }, lat: 30.4659, lng: 30.9308 },
    { name: { en: 'Qena', ar: 'قنا' }, lat: 26.1644, lng: 32.7267 },
    { name: { en: 'Beni Suef', ar: 'بني سويف' }, lat: 29.0661, lng: 31.0829 },
    { name: { en: 'Fayoum', ar: 'الفيوم' }, lat: 29.3084, lng: 30.8428 },
    { name: { en: 'Damietta', ar: 'دمياط' }, lat: 31.4165, lng: 31.8133 },
    { name: { en: 'Kafr El Sheikh', ar: 'كفر الشيخ' }, lat: 31.1095, lng: 30.9355 }
  ];

  // Load Leaflet CSS and JS from CDN
  useEffect(() => {
    const loadLeaflet = () => {
      const leafletCSS = document.createElement('link');
      leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      leafletCSS.rel = 'stylesheet';
      leafletCSS.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
      leafletCSS.crossOrigin = '';
      document.head.appendChild(leafletCSS);

      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      leafletJS.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
      leafletJS.crossOrigin = '';
      leafletJS.onload = () => {
        console.log('Leaflet loaded successfully');
      };
      document.head.appendChild(leafletJS);
    };

    if (typeof window !== 'undefined') {
      if (!window.L) {
        loadLeaflet();
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          findNearestGovernorate(position.coords.latitude, position.coords.longitude);
          searchNearbyHospitals(position.coords.latitude, position.coords.longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          alert(language === 'ar' ? 'فشل في الحصول على الموقع. يرجى التأكد من تفعيل خدمة الموقع.' : 'Failed to get location. Please enable location services.');
        }
      );
    } else {
      alert(language === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Geolocation is not supported by this browser.');
    }
  };

  // Find nearest governorate based on coordinates
  const findNearestGovernorate = (lat, lng) => {
    let nearest = governorates[0];
    let minDistance = Number.MAX_VALUE;

    governorates.forEach(gov => {
      const distance = Math.sqrt(Math.pow(gov.lat - lat, 2) + Math.pow(gov.lng - lng, 2));
      if (distance < minDistance) {
        minDistance = distance;
        nearest = gov;
      }
    });

    setGovernorate(nearest.name[language]);
  };

  // Search for hospitals using Nominatim API
  const searchNearbyHospitals = async (lat, lng) => {
    setLoading(true);
    try {
      // First search for hospitals in the area
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=hospital&format=json&addressdetails=1&limit=20&viewbox=${lng-0.1},${lat-0.1},${lng+0.1},${lat+0.1}&bounded=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const hospitalsData = data.map((item, index) => ({
          id: index,
          name: { 
            en: item.display_name.split(',')[0] || 'Hospital', 
            ar: item.display_name.split(',')[0] || 'مستشفى' 
          },
          address: { 
            en: item.display_name || 'Address not available',
            ar: item.display_name ? translateAddressToArabic(item.display_name) : 'العنوان غير متوفر'
          },
          governorate: { 
            en: item.address.state || 'Unknown', 
            ar: item.address.state ? translateToArabic(item.address.state) : 'غير معروف' 
          },
          specialties: { 
            en: ['General', 'Emergency'], 
            ar: ['عام', 'طوارئ'] 
          },
          phone: 'N/A',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
          image: `/hospital${(index % 5) + 1}.jpg` // Cycle through 5 hospital images
        }));
        
        setHospitals(hospitalsData);
        initMap(hospitalsData);
      } else {
        setHospitals([]);
        alert(language === 'ar' ? 'لم يتم العثور على مستشفيات قريبة' : 'No nearby hospitals found');
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء البحث عن المستشفيات' : 'Error searching for hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Search hospitals by governorate
  const searchHospitalsByGovernorate = async (gov) => {
    setLoading(true);
    try {
      const govObj = governorates.find(g => g.name[language] === gov);
      if (!govObj) return;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=hospital+in+${govObj.name.en}&format=json&addressdetails=1&limit=20`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const hospitalsData = data.map((item, index) => ({
          id: index,
          name: { 
            en: item.display_name.split(',')[0] || 'Hospital', 
            ar: item.display_name.split(',')[0] || 'مستشفى' 
          },
          address: { 
            en: item.display_name || 'Address not available',
            ar: item.display_name ? translateAddressToArabic(item.display_name) : 'العنوان غير متوفر'
          },
          governorate: { 
            en: govObj.name.en, 
            ar: govObj.name.ar 
          },
          specialties: { 
            en: ['General', 'Emergency'], 
            ar: ['عام', 'طوارئ'] 
          },
          phone: 'N/A',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
          image: `/hospital${(index % 5) + 1}.jpg` // Cycle through 5 hospital images
        }));
        
        setHospitals(hospitalsData);
        initMap(hospitalsData);
      } else {
        setHospitals([]);
        alert(language === 'ar' ? 'لم يتم العثور على مستشفيات في هذه المحافظة' : 'No hospitals found in this governorate');
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء البحث عن المستشفيات' : 'Error searching for hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Search hospitals by custom query
  const searchHospitalsByQuery = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}+hospital&format=json&addressdetails=1&limit=20`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const hospitalsData = data.map((item, index) => ({
          id: index,
          name: { 
            en: item.display_name.split(',')[0] || 'Hospital', 
            ar: item.display_name.split(',')[0] || 'مستشفى' 
          },
          address: { 
            en: item.display_name || 'Address not available',
            ar: item.display_name ? translateAddressToArabic(item.display_name) : 'العنوان غير متوفر'
          },
          governorate: { 
            en: item.address.state || 'Unknown', 
            ar: item.address.state ? translateToArabic(item.address.state) : 'غير معروف' 
          },
          specialties: { 
            en: ['General', 'Emergency'], 
            ar: ['عام', 'طوارئ'] 
          },
          phone: 'N/A',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
          image: `/hospital${(index % 5) + 1}.jpg` // Cycle through 5 hospital images
        }));
        
        setHospitals(hospitalsData);
        initMap(hospitalsData);
        
        // Find the governorate for the first result
        if (data[0].address.state) {
          const gov = governorates.find(g => 
            g.name.en.toLowerCase() === data[0].address.state.toLowerCase() ||
            g.name.ar === data[0].address.state
          );
          if (gov) setGovernorate(gov.name[language]);
        }
      } else {
        setHospitals([]);
        alert(language === 'ar' ? 'لم يتم العثور على مستشفيات تطابق البحث' : 'No hospitals matching the search');
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء البحث عن المستشفيات' : 'Error searching for hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to translate address to Arabic (simplified)
  const translateAddressToArabic = (address) => {
    const translations = {
      'Hospital': 'مستشفى',
      'Medical': 'طبي',
      'Center': 'مركز',
      'Street': 'شارع',
      'Road': 'طريق',
      'Avenue': 'جادة',
      'Square': 'ميدان',
      'District': 'حي',
      'City': 'مدينة',
      'Governorate': 'محافظة',
      'Egypt': 'مصر'
    };
    
    let arabicAddress = address;
    Object.keys(translations).forEach(key => {
      arabicAddress = arabicAddress.replace(new RegExp(key, 'gi'), translations[key]);
    });
    
    return arabicAddress;
  };

  // Helper function to translate governorate names to Arabic
  const translateToArabic = (name) => {
    const gov = governorates.find(g => g.name.en === name);
    return gov ? gov.name.ar : name;
  };

  // Initialize Leaflet Map
  const initMap = (hospitalsToShow) => {
    if (typeof window === 'undefined' || !window.L || !mapRef.current) {
      return;
    }

    // Clean up previous map instance if exists
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const center = userLocation || { 
      lat: hospitalsToShow[0]?.lat || 30.0444, 
      lng: hospitalsToShow[0]?.lng || 31.2357 
    };

    // Create new map instance
    mapInstance.current = window.L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 12
    });

    // Add tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // Add user location marker if available
    if (userLocation) {
      window.L.marker([userLocation.lat, userLocation.lng], {
        icon: window.L.divIcon({
          className: 'user-location-marker',
          html: '<div style="background-color: #4285F4; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [20, 20]
        })
      })
      .bindPopup(language === 'ar' ? 'موقعك الحالي' : 'Your Location')
      .addTo(mapInstance.current);
    }

    // Add hospital markers
    hospitalsToShow.forEach(hospital => {
      const marker = window.L.marker([hospital.lat, hospital.lng], {
        icon: window.L.divIcon({
          className: 'hospital-marker',
          html: '<div style="background-color: #e74c3c; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [20, 20]
        })
      })
      .bindPopup(`
        <div style="color: #333; min-width: 200px">
          <h3 style="color: #e74c3c; margin: 0 0 5px 0">${hospital.name[language]}</h3>
          <p style="margin: 0 0 5px 0">${hospital.address[language]}</p>
          <p style="margin: 0 0 5px 0; font-weight: bold">${hospital.specialties[language].join(', ')}</p>
          <div style="display: flex; align-items: center; margin-top: 5px">
            <span style="color: #f39c12; font-weight: bold">${hospital.rating}</span>
            <span style="color: #f39c12; margin-left: 5px">★</span>
          </div>
        </div>
      `)
      .on('click', () => {
        setSelectedHospital(hospital);
      })
      .addTo(mapInstance.current);
    });
  };

  // Handle governorate change
  const handleGovernorateChange = (e) => {
    const selectedGov = e.target.value;
    setGovernorate(selectedGov);
    searchHospitalsByGovernorate(selectedGov);
  };

  // Handle search query change
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Open directions in OpenStreetMap
  const openDirections = (hospital) => {
    if (!userLocation) {
      alert(language === 'ar' ? 'الرجاء تفعيل خدمة الموقع لتحديد المسار' : 'Please enable location services to get directions');
      return;
    }
    
    const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${userLocation.lat},${userLocation.lng};${hospital.lat},${hospital.lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (hospitals.length > 0 && mapRef.current && window.L) {
      initMap(hospitals);
    }
  }, [language, hospitals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <Head>
        <title>{language === 'ar' ? 'مستشفيات قريبة' : 'Nearby Hospitals'}</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl mb-6 border border-slate-700/50 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {language === 'ar' ? 'البحث عن مستشفيات قريبة' : 'Find Nearby Hospitals'}
            </h1>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base flex items-center gap-2"
              >
                <span className="text-lg">{language === 'ar' ? '🇺🇸' : '🇸🇦'}</span>
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search panel */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">
              {language === 'ar' ? 'ابحث عن مستشفيات' : 'Search for Hospitals'}
            </h2>
            
            <div className="space-y-4">
              {/* Search by text input */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  {language === 'ar' ? 'بحث بالاسم أو العنوان' : 'Search by name or address'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder={language === 'ar' ? 'ابحث عن مستشفى...' : 'Search for a hospital...'}
                    className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-white"
                  />
                  <button
                    onClick={searchHospitalsByQuery}
                    disabled={loading || !searchQuery.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Or separator */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-slate-700"></div>
                <span className="px-3 text-slate-500 text-sm">
                  {language === 'ar' ? 'أو' : 'OR'}
                </span>
                <div className="flex-1 border-t border-slate-700"></div>
              </div>
              
              {/* Search by governorate */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  {language === 'ar' ? 'البحث بالمحافظة' : 'Search by Governorate'}
                </label>
                <select
                  value={governorate}
                  onChange={handleGovernorateChange}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-white"
                >
                  <option value="">{language === 'ar' ? 'اختر المحافظة' : 'Select Governorate'}</option>
                  {governorates.map((gov, index) => (
                    <option key={index} value={gov.name[language]}>
                      {gov.name[language]}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Or separator */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-slate-700"></div>
                <span className="px-3 text-slate-500 text-sm">
                  {language === 'ar' ? 'أو' : 'OR'}
                </span>
                <div className="flex-1 border-t border-slate-700"></div>
              </div>
              
              {/* Search by current location */}
              <div className="pt-2">
                <button
                  onClick={getUserLocation}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {language === 'ar' ? 'استخدم موقعي الحالي' : 'Use My Current Location'}
                    </>
                  )}
                </button>
              </div>
              
              {/* Results */}
              {loading && hospitals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-slate-400">
                    {language === 'ar' ? 'جاري البحث عن المستشفيات...' : 'Searching for hospitals...'}
                  </p>
                </div>
              ) : hospitals.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-300">
                    {language === 'ar' ? 
                      `تم العثور على ${hospitals.length} مستشفى` : 
                      `Found ${hospitals.length} hospitals`
                    }
                  </h3>
                  
                  <div className="max-h-[400px] overflow-y-auto pr-2">
                    {hospitals.map(hospital => (
                      <div 
                        key={hospital.id}
                        onClick={() => setSelectedHospital(hospital)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedHospital?.id === hospital.id
                            ? 'bg-emerald-500/20 border border-emerald-400/50'
                            : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-700/50'
                        }`}
                      >
                        <h4 className="font-medium text-emerald-400">{hospital.name[language]}</h4>
                        <p className="text-sm text-slate-400">{hospital.address[language].split(',').slice(0, 3).join(',')}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hospital.specialties[language].slice(0, 3).map((spec, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-800/70 rounded-full text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (governorate || searchQuery) && !loading ? (
                <div className="text-center py-8 text-slate-400">
                  {language === 'ar' ? 
                    'لم يتم العثور على مستشفيات' : 
                    'No hospitals found'
                  }
                </div>
              ) : null}
            </div>
          </div>

          {/* Map and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map container */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <div 
                ref={mapRef} 
                className="w-full h-[400px] sm:h-[500px] rounded-xl"
              />
            </div>
            
            {/* Hospital details */}
            {selectedHospital && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Hospital image */}
                  <div className="md:w-1/3">
                    <div className="aspect-w-16 aspect-h-9 bg-slate-700 rounded-lg overflow-hidden">
                      <img 
                        src={selectedHospital.image} 
                        alt={selectedHospital.name[language]}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/hospital-default.jpg';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Hospital info */}
                  <div className="md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-emerald-400">
                          {selectedHospital.name[language]}
                        </h2>
                        <p className="text-slate-400">
                          {selectedHospital.address[language].split(',').slice(0, 4).join(',')}
                        </p>
                      </div>
                      
                      <div className="flex items-center bg-slate-900/70 px-3 py-1 rounded-full">
                        <span className="text-yellow-400 font-bold">{selectedHospital.rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-slate-300 mb-2">
                          {language === 'ar' ? 'التخصصات' : 'Specialties'}
                        </h3>
                        <ul className="space-y-1">
                          {selectedHospital.specialties[language].map((spec, i) => (
                            <li key={i} className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-slate-300 mb-2">
                          {language === 'ar' ? 'الموقع' : 'Location'}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span>{selectedHospital.address[language].split(',').slice(0, 4).join(',')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => openDirections(selectedHospital)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        {language === 'ar' ? 'كيفية الوصول' : 'Get Directions'}
                      </button>
                      
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedHospital.lat},${selectedHospital.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!selectedHospital && hospitals.length > 0 && (
              <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-dashed border-slate-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="mt-4 text-slate-400">
                  {language === 'ar' ? 
                    'اختر مستشفى لعرض التفاصيل' : 
                    'Select a hospital to view details'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .loading-spinner {
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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
        
        /* Leaflet map styles */
        .leaflet-container {
          background-color: #1e293b;
        }
        .leaflet-popup-content {
          color: #333;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}