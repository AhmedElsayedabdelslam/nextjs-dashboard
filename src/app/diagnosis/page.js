'use client';
import React, { useState, useEffect } from 'react';
import Header from '../ui/header';

const AI_API_URL = '/api/ai-diagnosis'; // سوف ننشئ هذا الAPI route بعد ذلك

export default function ComprehensiveMedicalDiagnosis() {
      useEffect(()=>{
        document.title='Diagonis'
      })
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('en');
    const [aiResponse, setAiResponse] = useState('');
    const [showAiDialog, setShowAiDialog] = useState(false);

    // قاعدة بيانات كاملة لأجزاء الجسم بالأنجليزية والعربية
    const bodyRegions = [
        {
            id: 'head',
            name: { en: 'Head & Neck', ar: 'الرأس والرقبة' },
            icon: '🧠',
            organs: [
                {
                    name: { en: 'Brain', ar: 'المخ' },
                    symptoms: [
                        { en: 'Headache', ar: 'صداع' },
                        { en: 'Dizziness', ar: 'دوخة' },
                        { en: 'Confusion', ar: 'تشوش' },
                        { en: 'Memory loss', ar: 'فقدان الذاكرة' },
                        { en: 'Seizures', ar: 'نوبات صرع' }
                    ]
                },
                {
                    name: { en: 'Eyes', ar: 'العينين' },
                    symptoms: [
                        { en: 'Blurred vision', ar: 'عدم وضوح الرؤية' },
                        { en: 'Eye pain', ar: 'ألم في العين' },
                        { en: 'Redness', ar: 'احمرار' },
                        { en: 'Dry eyes', ar: 'جفاف العين' },
                        { en: 'Double vision', ar: 'ازدواجية الرؤية' }
                    ]
                },
                {
                    name: { en: 'Ears', ar: 'الأذنين' },
                    symptoms: [
                        { en: 'Hearing loss', ar: 'فقدان السمع' },
                        { en: 'Ear pain', ar: 'ألم الأذن' },
                        { en: 'Tinnitus', ar: 'طنين الأذن' },
                        { en: 'Discharge', ar: 'إفرازات' },
                        { en: 'Vertigo', ar: 'دوار' }
                    ]
                },
                {
                    name: { en: 'Nose', ar: 'الأنف' },
                    symptoms: [
                        { en: 'Nasal congestion', ar: 'احتقان الأنف' },
                        { en: 'Runny nose', ar: 'سيلان الأنف' },
                        { en: 'Nosebleeds', ar: 'نزيف الأنف' },
                        { en: 'Loss of smell', ar: 'فقدان حاسة الشم' },
                        { en: 'Sinus pain', ar: 'ألم الجيوب الأنفية' }
                    ]
                },
                {
                    name: { en: 'Mouth & Throat', ar: 'الفم والحلق' },
                    symptoms: [
                        { en: 'Sore throat', ar: 'التهاب الحلق' },
                        { en: 'Difficulty swallowing', ar: 'صعوبة البلع' },
                        { en: 'Mouth ulcers', ar: 'قرح الفم' },
                        { en: 'Bleeding gums', ar: 'نزيف اللثة' },
                        { en: 'Hoarseness', ar: 'بحة الصوت' }
                    ]
                }
            ]
        },
        {
            id: 'chest',
            name: { en: 'Chest', ar: 'الصدر' },
            icon: '❤️',
            organs: [
                {
                    name: { en: 'Heart', ar: 'القلب' },
                    symptoms: [
                        { en: 'Chest pain', ar: 'ألم في الصدر' },
                        { en: 'Palpitations', ar: 'خفقان' },
                        { en: 'Shortness of breath', ar: 'ضيق في التنفس' },
                        { en: 'Irregular heartbeat', ar: 'عدم انتظام ضربات القلب' },
                        { en: 'Swelling in legs', ar: 'تورم في الساقين' }
                    ]
                },
                {
                    name: { en: 'Lungs', ar: 'الرئتين' },
                    symptoms: [
                        { en: 'Cough', ar: 'سعال' },
                        { en: 'Wheezing', ar: 'صفير' },
                        { en: 'Chest tightness', ar: 'ضيق في الصدر' },
                        { en: 'Coughing up blood', ar: 'سعال الدم' },
                        { en: 'Rapid breathing', ar: 'تنفس سريع' }
                    ]
                },
                {
                    name: { en: 'Esophagus', ar: 'المريء' },
                    symptoms: [
                        { en: 'Heartburn', ar: 'حرقة المعدة' },
                        { en: 'Acid reflux', ar: 'ارتجاع حمضي' },
                        { en: 'Painful swallowing', ar: 'بلع مؤلم' },
                        { en: 'Food stuck sensation', ar: 'إحساس بوجود طعام عالق' }
                    ]
                }
            ]
        },
        {
            id: 'abdomen',
            name: { en: 'Abdomen', ar: 'البطن' },
            icon: '🩺',
            organs: [
                {
                    name: { en: 'Stomach', ar: 'المعدة' },
                    symptoms: [
                        { en: 'Stomach pain', ar: 'ألم المعدة' },
                        { en: 'Nausea', ar: 'غثيان' },
                        { en: 'Vomiting', ar: 'قيء' },
                        { en: 'Bloating', ar: 'انتفاخ' },
                        { en: 'Loss of appetite', ar: 'فقدان الشهية' }
                    ]
                },
                {
                    name: { en: 'Liver', ar: 'الكبد' },
                    symptoms: [
                        { en: 'Jaundice', ar: 'اليرقان' },
                        { en: 'Abdominal swelling', ar: 'تورم البطن' },
                        { en: 'Dark urine', ar: 'بول داكن' },
                        { en: 'Fatigue', ar: 'إرهاق' }
                    ]
                },
                {
                    name: { en: 'Pancreas', ar: 'البنكرياس' },
                    symptoms: [
                        { en: 'Severe abdominal pain', ar: 'ألم شديد في البطن' },
                        { en: 'Back pain', ar: 'ألم الظهر' },
                        { en: 'Nausea', ar: 'غثيان' },
                        { en: 'Oily stools', ar: 'براز دهني' }
                    ]
                },
                {
                    name: { en: 'Kidneys', ar: 'الكلى' },
                    symptoms: [
                        { en: 'Flank pain', ar: 'ألم الخاصرة' },
                        { en: 'Painful urination', ar: 'تبول مؤلم' },
                        { en: 'Blood in urine', ar: 'دم في البول' },
                        { en: 'Frequent urination', ar: 'تبول متكرر' }
                    ]
                },
                {
                    name: { en: 'Intestines', ar: 'الأمعاء' },
                    symptoms: [
                        { en: 'Diarrhea', ar: 'إسهال' },
                        { en: 'Constipation', ar: 'إمساك' },
                        { en: 'Abdominal cramps', ar: 'تشنجات بطنية' },
                        { en: 'Rectal bleeding', ar: 'نزيف شرجي' },
                        { en: 'Gas', ar: 'غازات' }
                    ]
                }
            ]
        },
        {
            id: 'pelvis',
            name: { en: 'Pelvis', ar: 'الحوض' },
            icon: '🦴',
            organs: [
                {
                    name: { en: 'Bladder', ar: 'المثانة' },
                    symptoms: [
                        { en: 'Urinary urgency', ar: 'حاجة ملحة للتبول' },
                        { en: 'Incontinence', ar: 'سلس البول' },
                        { en: 'Pelvic pain', ar: 'ألم الحوض' }
                    ]
                },
                {
                    name: { en: 'Reproductive (Male)', ar: 'الجهاز التناسلي (ذكر)' },
                    symptoms: [
                        { en: 'Testicular pain', ar: 'ألم الخصية' },
                        { en: 'Erectile dysfunction', ar: 'ضعف الانتصاب' },
                        { en: 'Penile discharge', ar: 'إفرازات القضيب' }
                    ]
                },
                {
                    name: { en: 'Reproductive (Female)', ar: 'الجهاز التناسلي (أنثى)' },
                    symptoms: [
                        { en: 'Pelvic pain', ar: 'ألم الحوض' },
                        { en: 'Vaginal bleeding', ar: 'نزيف مهبلي' },
                        { en: 'Vaginal discharge', ar: 'إفرازات مهبلية' },
                        { en: 'Painful periods', ar: 'فترات مؤلمة' }
                    ]
                }
            ]
        },
        {
            id: 'extremities',
            name: { en: 'Extremities', ar: 'الأطراف' },
            icon: '🦵',
            organs: [
                {
                    name: { en: 'Arms', ar: 'الذراعين' },
                    symptoms: [
                        { en: 'Arm pain', ar: 'ألم الذراع' },
                        { en: 'Numbness', ar: 'خدر' },
                        { en: 'Weakness', ar: 'ضعف' },
                        { en: 'Swelling', ar: 'تورم' }
                    ]
                },
                {
                    name: { en: 'Legs', ar: 'الساقين' },
                    symptoms: [
                        { en: 'Leg pain', ar: 'ألم الساق' },
                        { en: 'Cramps', ar: 'تشنجات' },
                        { en: 'Varicose veins', ar: 'الدوالي' },
                        { en: 'Swelling', ar: 'تورم' }
                    ]
                },
                {
                    name: { en: 'Joints', ar: 'المفاصل' },
                    symptoms: [
                        { en: 'Joint pain', ar: 'ألم المفاصل' },
                        { en: 'Stiffness', ar: 'تيبس' },
                        { en: 'Swelling', ar: 'تورم' },
                        { en: 'Redness', ar: 'احمرار' }
                    ]
                }
            ]
        },
        {
            id: 'back',
            name: { en: 'Back', ar: 'الظهر' },
            icon: '🦴',
            organs: [
                {
                    name: { en: 'Spine', ar: 'العمود الفقري' },
                    symptoms: [
                        { en: 'Back pain', ar: 'ألم الظهر' },
                        { en: 'Limited mobility', ar: 'محدودية الحركة' },
                        { en: 'Radiating pain', ar: 'ألم يشع' },
                        { en: 'Numbness', ar: 'خدر' }
                    ]
                }
            ]
        },
        {
            id: 'skin',
            name: { en: 'Skin', ar: 'الجلد' },
            icon: '🖐️',
            organs: [
                {
                    name: { en: 'Skin', ar: 'الجلد' },
                    symptoms: [
                        { en: 'Rash', ar: 'طفح جلدي' },
                        { en: 'Itching', ar: 'حكة' },
                        { en: 'Dryness', ar: 'جفاف' },
                        { en: 'Lesions', ar: 'آفات جلدية' },
                        { en: 'Discoloration', ar: 'تغير اللون' }
                    ]
                }
            ]
        },
        {
            id: 'endocrine',
            name: { en: 'Endocrine System', ar: 'الجهاز الصماوي' },
            icon: '⚖️',
            organs: [
                {
                    name: { en: 'Thyroid', ar: 'الغدة الدرقية' },
                    symptoms: [
                        { en: 'Neck swelling', ar: 'تورم الرقبة' },
                        { en: 'Fatigue', ar: 'إرهاق' },
                        { en: 'Weight changes', ar: 'تغيرات الوزن' },
                        { en: 'Heat/cold intolerance', ar: 'عدم تحمل الحرارة/البرودة' }
                    ]
                }
            ]
        },
        {
            id: 'nervous',
            name: { en: 'Nervous System', ar: 'الجهاز العصبي' },
            icon: '🧠',
            organs: [
                {
                    name: { en: 'Nerves', ar: 'الأعصاب' },
                    symptoms: [
                        { en: 'Tingling', ar: 'وخز' },
                        { en: 'Numbness', ar: 'خدر' },
                        { en: 'Muscle weakness', ar: 'ضعف العضلات' },
                        { en: 'Coordination problems', ar: 'مشاكل في التنسيق' }
                    ]
                }
            ]
        }
    ];

    // دالة للتواصل مع الذكاء الاصطناعي
    const consultAI = async () => {
        if (!symptoms) return;

        setLoading(true);
        setAiResponse('');
        setShowAiDialog(true);

        try {
            const response = await fetch(AI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms: symptoms,
                    organ: selectedOrgan.name[language],
                    language: language
                })
            });

            const data = await response.json();
            setAiResponse(data.response);
        } catch (error) {
            setAiResponse(language === 'en' ? 'Error connecting to AI' : 'خطأ في الاتصال بالذكاء الاصطناعي');
        }

        setLoading(false);
    };

    // دالة لتشخيص الحالة
    const handleDiagnose = async () => {
        setLoading(true);

        try {
            // أولاً: التشخيص بناء على قاعدة البيانات المحلية
            const localDiagnosis = diagnoseLocally();

            // ثانياً: الحصول على تشخيص من الذكاء الاصطناعي
            await consultAI();

            setDiagnosis({
                ...localDiagnosis,
                aiAdvice: aiResponse
            });
        } catch (error) {
            console.error('Diagnosis error:', error);
        }

        setLoading(false);
    };

    // دالة للتشخيص المحلي
    const diagnoseLocally = () => {
        // هنا يمكنك إضافة منطق التشخيص المحلي
        return {
            condition: { en: 'Preliminary Assessment', ar: 'تقييم أولي' },
            recommendations: [
                { en: 'Rest and monitor symptoms', ar: 'الرصد ومراقبة الأعراض' },
                { en: 'Drink plenty of fluids', ar: 'اشرب الكثير من السوائل' }
            ]
        };
    };

    // دالة لإنشاء الوصفة الطبية
    const generatePrescription = () => {
        const printContent = `
      <html>
        <head>
          <title>${language === 'en' ? 'Medical Prescription' : 'وصفة طبية'}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .patient-info { margin-bottom: 15px; }
            .diagnosis { background: #f0f0f0; padding: 15px; border-radius: 5px; }
            .footer { margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${language === 'en' ? 'MediScan+ Prescription' : 'وصفة طبية من ميديسكان+'}</h2>
          </div>
          
          <div class="patient-info">
            <h3>${language === 'en' ? 'Patient Information' : 'معلومات المريض'}</h3>
            <p><strong>${language === 'en' ? 'Affected Area:' : 'المنطقة المصابة:'}</strong> ${selectedRegion.name[language]} > ${selectedOrgan.name[language]}</p>
          </div>
          
          <div class="diagnosis">
            <h3>${language === 'en' ? 'Diagnosis' : 'التشخيص'}</h3>
            <p>${diagnosis.condition[language]}</p>
            ${aiResponse ? `<p><strong>${language === 'en' ? 'AI Advice:' : 'نصيحة الذكاء الاصطناعي:'}</strong> ${aiResponse}</p>` : ''}
          </div>
          
          <div class="footer">
            <p>${new Date().toLocaleDateString()} | ${language === 'en' ? 'Generated by MediScan+ AI' : 'تم إنشاؤه بواسطة ذكاء ميديسكان+'}</p>
          </div>
        </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <>

            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
                <div className="max-w-7xl mx-auto">
                    {/* شريط اللغة */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            {language === 'en' ? 'العربية' : 'English'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* قسم خريطة الجسم */}
                        <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                {language === 'en' ? 'Select Affected Area' : 'حدد المنطقة المصابة'}
                            </h2>

                            {/* مناطق الجسم */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                {bodyRegions.map(region => (
                                    <button
                                        key={region.id}
                                        onClick={() => setSelectedRegion(region)}
                                        className={`p-4 rounded-lg flex flex-col items-center transition-all ${selectedRegion?.id === region.id
                                                ? 'bg-cyan-500/20 border border-cyan-400/50'
                                                : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-700/50'
                                            }`}
                                    >
                                        <span className="text-2xl mb-2">{region.icon}</span>
                                        <span className="font-medium">{region.name[language]}</span>
                                    </button>
                                ))}
                            </div>

                            {/* الأعضاء */}
                            {selectedRegion && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium mb-4 text-slate-300">
                                        {language === 'en' ? 'Select specific organ:' : 'حدد العضو المحدد:'}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {selectedRegion.organs.map((organ, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedOrgan(organ)}
                                                className={`px-4 py-3 rounded-lg text-left transition-all ${selectedOrgan?.name.en === organ.name.en
                                                        ? 'bg-cyan-500/20 border border-cyan-400/50'
                                                        : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50'
                                                    }`}
                                            >
                                                {organ.name[language]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* وصف الأعراض */}
                            {selectedOrgan && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4 text-slate-300">
                                        {language === 'en'
                                            ? `Describe your ${selectedOrgan.name.en.toLowerCase()} symptoms:`
                                            : `صف أعراض ${selectedOrgan.name.ar}:`}
                                    </h3>
                                    <textarea
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white placeholder-slate-500"
                                        placeholder={language === 'en' ? "Describe your symptoms in detail..." : "صف أعراضك بالتفصيل..."}
                                    />

                                    {/* الأعراض الشائعة */}
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-400 mb-2">
                                            {language === 'en' ? 'Common symptoms:' : 'الأعراض الشائعة:'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedOrgan.symptoms.map((symptom, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-slate-700/50 rounded-full text-sm cursor-pointer hover:bg-cyan-500/20"
                                                    onClick={() => setSymptoms(prev => prev ? `${prev}, ${symptom[language]}` : symptom[language])}
                                                >
                                                    {symptom[language]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* زر استشارة الذكاء الاصطناعي */}
                                    <div className="mt-6 flex justify-between">
                                        <button
                                            onClick={() => setShowAiDialog(true)}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-2"
                                        >
                                            <span>💡</span>
                                            {language === 'en' ? 'Consult AI' : 'استشارة الذكاء الاصطناعي'}
                                        </button>

                                        <button
                                            onClick={handleDiagnose}
                                            disabled={!symptoms || loading}
                                            className={`px-6 py-2 rounded-lg font-medium ${!symptoms || loading
                                                    ? 'bg-slate-700 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500'
                                                }`}
                                        >
                                            {language === 'en' ? 'Diagnose' : 'تشخيص'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* لوحة التشخيص */}
                        <div className="lg:sticky lg:top-6 lg:h-fit">
                            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full">
                                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                                    {language === 'en' ? 'Diagnosis' : 'التشخيص'}
                                </h2>

                                {diagnosis ? (
                                    <div className="space-y-4">
                                        <div className="bg-slate-900/50 rounded-lg p-4">
                                            <h3 className="font-bold text-cyan-400">
                                                {language === 'en' ? 'Condition' : 'الحالة'}
                                            </h3>
                                            <p>{diagnosis.condition[language]}</p>
                                        </div>

                                        {aiResponse && (
                                            <div className="bg-slate-900/50 rounded-lg p-4">
                                                <h3 className="font-bold text-cyan-400">
                                                    {language === 'en' ? 'AI Analysis' : 'تحليل الذكاء الاصطناعي'}
                                                </h3>
                                                <p>{aiResponse}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={generatePrescription}
                                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg mt-4"
                                        >
                                            {language === 'en' ? 'Generate Report' : 'إنشاء تقرير'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>{language === 'en'
                                            ? 'No diagnosis yet. Describe your symptoms and click Diagnose.'
                                            : 'لا يوجد تشخيص بعد. صف أعراضك وانقر على تشخيص'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* نافذة حوار الذكاء الاصطناعي */}
                {showAiDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-cyan-400">
                                    {language === 'en' ? 'AI Medical Assistant' : 'مساعد طبي بالذكاء الاصطناعي'}
                                </h3>
                                <button
                                    onClick={() => setShowAiDialog(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4">
                                <p className="font-medium mb-2">
                                    {language === 'en' ? 'Your symptoms:' : 'أعراضك:'}
                                </p>
                                <p className="bg-slate-700 p-3 rounded-lg">{symptoms}</p>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="loading-spinner mx-auto mb-4"></div>
                                    <p>{language === 'en' ? 'Plaese wait for analyzing...' : 'جاري التحليل...'}</p>
                                </div>
                            ) : (
                                <div>
                                    {aiResponse ? (
                                        <div className="bg-slate-900/50 p-4 rounded-lg">
                                            <p className="whitespace-pre-line">{aiResponse}</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={consultAI}
                                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg"
                                        >
                                            {language === 'en' ? 'Ask AI for Diagnosis' : 'اسأل الذكاء الاصطناعي للتشخيص'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <style jsx global>{`
        .loading-spinner {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
            </div>
        </>
    );
}