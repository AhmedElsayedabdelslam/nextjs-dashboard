



'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../ui/header';

const RX_NORM_API_URL = 'https://rxnav.nlm.nih.gov/REST';
const MEDICATION_API_URL = '/api/medication-ai'; // Fallback API

export default function MedicationDatabase() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [medicationData, setMedicationData] = useState(null);
    const [parsedData, setParsedData] = useState({});
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('en');
    const [showDetails, setShowDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('brands');
    const [drugInteractions, setDrugInteractions] = useState([]);
    const router = useRouter();

    // Enhanced medical conditions with categories and RxNorm concept IDs
    const medicalConditions = [
        {
            category: { en: 'Respiratory', ar: 'الجهاز التنفسي' },
            conditions: [
                { en: 'Cough', ar: 'سعال', icon: '🤧', severity: 'common', rxcui: '198440' },
                { en: 'Cold', ar: 'نزلة برد', icon: '🥶', severity: 'common', rxcui: '198440' },
                { en: 'Flu', ar: 'إنفلونزا', icon: '🤒', severity: 'common', rxcui: '5628' },
                { en: 'Asthma', ar: 'الربو', icon: '🌬️', severity: 'chronic', rxcui: '1191' },
                { en: 'Bronchitis', ar: 'التهاب الشعب الهوائية', icon: '🫁', severity: 'acute', rxcui: '17198' },
                { en: 'Pneumonia', ar: 'التهاب رئوي', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Sinusitis', ar: 'التهاب الجيوب الأنفية', icon: '👃', severity: 'acute', rxcui: '19543' },
                { en: 'Allergic Rhinitis', ar: 'التهاب الأنف التحسسي', icon: '🌸', severity: 'chronic', rxcui: '9133' },
                { en: 'COPD', ar: 'مرض الانسداد الرئوي المزمن', icon: '🚬', severity: 'chronic', rxcui: '85492' },
                { en: 'Tuberculosis', ar: 'السل', icon: '🦠', severity: 'chronic', rxcui: '11373' },
                { en: 'Laryngitis', ar: 'التهاب الحنجرة', icon: '🗣️', severity: 'acute', rxcui: '19768' },
                { en: 'Pharyngitis', ar: 'التهاب البلعوم', icon: '👄', severity: 'acute', rxcui: '19768' },
                { en: 'Tonsillitis', ar: 'التهاب اللوزتين', icon: '👅', severity: 'acute', rxcui: '19768' },
                { en: 'Pleurisy', ar: 'التهاب الجنبة', icon: '😫', severity: 'acute', rxcui: '19768' },
                { en: 'Pulmonary Embolism', ar: 'الانسداد الرئوي', icon: '💔', severity: 'acute', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Cardiovascular', ar: 'أمراض القلب والأوعية الدموية' },
            conditions: [
                { en: 'High Blood Pressure', ar: 'ضغط الدم المرتفع', icon: '❤️', severity: 'chronic', rxcui: '5961' },
                { en: 'Coronary Artery Disease', ar: 'مرض الشريان التاجي', icon: '🫀', severity: 'chronic', rxcui: '5961' },
                { en: 'Heart Failure', ar: 'فشل القلب', icon: '💔', severity: 'chronic', rxcui: '5961' },
                { en: 'Arrhythmia', ar: 'اضطراب نظم القلب', icon: '💓', severity: 'chronic', rxcui: '5961' },
                { en: 'Atrial Fibrillation', ar: 'الرجفان الأذيني', icon: '💓', severity: 'chronic', rxcui: '5961' },
                { en: 'Angina', ar: 'الذبحة الصدرية', icon: '💔', severity: 'chronic', rxcui: '5961' },
                { en: 'Myocardial Infarction', ar: 'احتشاء عضلة القلب', icon: '💔', severity: 'acute', rxcui: '5961' },
                { en: 'Pericarditis', ar: 'التهاب التامور', icon: '🫀', severity: 'acute', rxcui: '5961' },
                { en: 'Endocarditis', ar: 'التهاب الشغاف', icon: '🫀', severity: 'acute', rxcui: '5961' },
                { en: 'Cardiomyopathy', ar: 'اعتلال عضلة القلب', icon: '🫀', severity: 'chronic', rxcui: '5961' },
                { en: 'Varicose Veins', ar: 'الدوالي', icon: '🦵', severity: 'chronic', rxcui: '5961' },
                { en: 'Deep Vein Thrombosis', ar: 'جلطة الأوردة العميقة', icon: '🦵', severity: 'acute', rxcui: '5961' },
                { en: 'Atherosclerosis', ar: 'تصلب الشرايين', icon: '🩸', severity: 'chronic', rxcui: '5961' },
                { en: 'Hypercholesterolemia', ar: 'ارتفاع الكوليسترول', icon: '🩸', severity: 'chronic', rxcui: '5961' },
                { en: 'Hypertension Crisis', ar: 'أزمة ارتفاع ضغط الدم', icon: '🆘', severity: 'acute', rxcui: '5961' }
            ]
        },
        {
            category: { en: 'Gastrointestinal', ar: 'الجهاز الهضمي' },
            conditions: [
                { en: 'Stomach Pain', ar: 'ألم المعدة', icon: '🩹', severity: 'common', rxcui: '6894' },
                { en: 'Acid Reflux', ar: 'ارتجاع حمضي', icon: '🔥', severity: 'chronic', rxcui: '93705' },
                { en: 'GERD', ar: 'ارتجاع المريء', icon: '🔥', severity: 'chronic', rxcui: '93705' },
                { en: 'Gastritis', ar: 'التهاب المعدة', icon: '🤢', severity: 'acute', rxcui: '19768' },
                { en: 'Peptic Ulcer', ar: 'قرحة هضمية', icon: '🩹', severity: 'chronic', rxcui: '19768' },
                { en: 'Diarrhea', ar: 'إسهال', icon: '🚽', severity: 'acute', rxcui: '34198' },
                { en: 'Constipation', ar: 'إمساك', icon: '🪠', severity: 'common', rxcui: '310965' },
                { en: 'Irritable Bowel Syndrome', ar: 'متلازمة القولون العصبي', icon: '🤯', severity: 'chronic', rxcui: '19768' },
                { en: 'Crohn\'s Disease', ar: 'داء كرون', icon: '🤢', severity: 'chronic', rxcui: '19768' },
                { en: 'Ulcerative Colitis', ar: 'التهاب القولون التقرحي', icon: '🤢', severity: 'chronic', rxcui: '19768' },
                { en: 'Diverticulitis', ar: 'التهاب الرتج', icon: '🤢', severity: 'acute', rxcui: '19768' },
                { en: 'Hemorrhoids', ar: 'البواسير', icon: '🩸', severity: 'common', rxcui: '19768' },
                { en: 'Gallstones', ar: 'حصوات المرارة', icon: '💎', severity: 'acute', rxcui: '19768' },
                { en: 'Pancreatitis', ar: 'التهاب البنكرياس', icon: '🤢', severity: 'acute', rxcui: '19768' },
                { en: 'Hepatitis', ar: 'التهاب الكبد', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Cirrhosis', ar: 'تليف الكبد', icon: '🍺', severity: 'chronic', rxcui: '19768' },
                { en: 'Food Poisoning', ar: 'تسمم غذائي', icon: '🤮', severity: 'acute', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Neurological', ar: 'الجهاز العصبي' },
            conditions: [
                { en: 'Migraine', ar: 'صداع نصفي', icon: '🧠', severity: 'chronic', rxcui: '7262' },
                { en: 'Headache', ar: 'صداع', icon: '🤕', severity: 'common', rxcui: '5487' },
                { en: 'Epilepsy', ar: 'الصرع', icon: '⚡', severity: 'chronic', rxcui: '19768' },
                { en: 'Parkinson\'s Disease', ar: 'مرض باركنسون', icon: '🧓', severity: 'chronic', rxcui: '19768' },
                { en: 'Alzheimer\'s Disease', ar: 'مرض الزهايمر', icon: '🧠', severity: 'chronic', rxcui: '19768' },
                { en: 'Multiple Sclerosis', ar: 'التصلب المتعدد', icon: '🧠', severity: 'chronic', rxcui: '19768' },
                { en: 'Stroke', ar: 'سكتة دماغية', icon: '🆘', severity: 'acute', rxcui: '19768' },
                { en: 'Transient Ischemic Attack', ar: 'نوبة إقفارية عابرة', icon: '🆘', severity: 'acute', rxcui: '19768' },
                { en: 'Bell\'s Palsy', ar: 'شلل الوجه النصفي', icon: '😐', severity: 'acute', rxcui: '19768' },
                { en: 'Neuropathy', ar: 'اعتلال الأعصاب', icon: '🦶', severity: 'chronic', rxcui: '19768' },
                { en: 'Sciatica', ar: 'عرق النسا', icon: '🦵', severity: 'chronic', rxcui: '19768' },
                { en: 'Meningitis', ar: 'التهاب السحايا', icon: '🧠', severity: 'acute', rxcui: '19768' },
                { en: 'Encephalitis', ar: 'التهاب الدماغ', icon: '🧠', severity: 'acute', rxcui: '19768' },
                { en: 'Brain Tumor', ar: 'ورم دماغي', icon: '🧠', severity: 'chronic', rxcui: '19768' },
                { en: 'Concussion', ar: 'ارتجاج', icon: '🤕', severity: 'acute', rxcui: '19768' },
                { en: 'Vertigo', ar: 'دوار', icon: '🌀', severity: 'acute', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Musculoskeletal', ar: 'العضلات والعظام' },
            conditions: [
                { en: 'Arthritis', ar: 'التهاب المفاصل', icon: '🦴', severity: 'chronic', rxcui: '152923' },
                { en: 'Osteoarthritis', ar: 'التهاب المفاصل التنكسي', icon: '🦴', severity: 'chronic', rxcui: '152923' },
                { en: 'Rheumatoid Arthritis', ar: 'التهاب المفاصل الروماتويدي', icon: '🦴', severity: 'chronic', rxcui: '152923' },
                { en: 'Osteoporosis', ar: 'هشاشة العظام', icon: '🦴', severity: 'chronic', rxcui: '19768' },
                { en: 'Back Pain', ar: 'ألم الظهر', icon: '🧑‍⚕️', severity: 'common', rxcui: '6894' },
                { en: 'Neck Pain', ar: 'ألم الرقبة', icon: '👤', severity: 'common', rxcui: '6894' },
                { en: 'Muscle Pain', ar: 'ألم عضلي', icon: '💪', severity: 'common', rxcui: '6894' },
                { en: 'Fibromyalgia', ar: 'فيبروميالغيا', icon: '🤕', severity: 'chronic', rxcui: '19768' },
                { en: 'Gout', ar: 'النقرس', icon: '🦶', severity: 'acute', rxcui: '19768' },
                { en: 'Bursitis', ar: 'التهاب الجراب', icon: '🦵', severity: 'acute', rxcui: '19768' },
                { en: 'Tendinitis', ar: 'التهاب الأوتار', icon: '💪', severity: 'acute', rxcui: '19768' },
                { en: 'Carpal Tunnel Syndrome', ar: 'متلازمة النفق الرسغي', icon: '✋', severity: 'chronic', rxcui: '19768' },
                { en: 'Scoliosis', ar: 'الجنف', icon: '🧍', severity: 'chronic', rxcui: '19768' },
                { en: 'Herniated Disc', ar: 'انزلاق غضروفي', icon: '🦴', severity: 'acute', rxcui: '19768' },
                { en: 'Sprain', ar: 'التواء', icon: '🦶', severity: 'acute', rxcui: '19768' },
                { en: 'Fracture', ar: 'كسر', icon: '🦴', severity: 'acute', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Endocrine', ar: 'الغدد الصماء' },
            conditions: [
                { en: 'Diabetes', ar: 'مرض السكري', icon: '🩸', severity: 'chronic', rxcui: '8364' },
                { en: 'Hypothyroidism', ar: 'قصور الغدة الدرقية', icon: '🦋', severity: 'chronic', rxcui: '19768' },
                { en: 'Hyperthyroidism', ar: 'فرط نشاط الغدة الدرقية', icon: '🦋', severity: 'chronic', rxcui: '19768' },
                { en: 'Thyroid Nodules', ar: 'عقيدات الغدة الدرقية', icon: '🦋', severity: 'chronic', rxcui: '19768' },
                { en: 'Goiter', ar: 'تضخم الغدة الدرقية', icon: '🦋', severity: 'chronic', rxcui: '19768' },
                { en: 'Addison\'s Disease', ar: 'مرض أديسون', icon: '⚖️', severity: 'chronic', rxcui: '19768' },
                { en: 'Cushing\'s Syndrome', ar: 'متلازمة كوشينغ', icon: '⚖️', severity: 'chronic', rxcui: '19768' },
                { en: 'PCOS', ar: 'متلازمة المبيض المتعدد الكيسات', icon: '🌸', severity: 'chronic', rxcui: '19768' },
                { en: 'Osteoporosis', ar: 'هشاشة العظام', icon: '🦴', severity: 'chronic', rxcui: '19768' },
                { en: 'Hyperparathyroidism', ar: 'فرط نشاط جارات الدرق', icon: '🦋', severity: 'chronic', rxcui: '19768' },
                { en: 'Hypoparathyroidism', ar: 'قصور جارات الدرق', icon: '🦋', severity: 'chronic', rxcui: '19768' },
                { en: 'Diabetes Insipidus', ar: 'البوالة التفهة', icon: '💧', severity: 'chronic', rxcui: '19768' },
                { en: 'Metabolic Syndrome', ar: 'المتلازمة الأيضية', icon: '⚖️', severity: 'chronic', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Dermatological', ar: 'الأمراض الجلدية' },
            conditions: [
                { en: 'Acne', ar: 'حب الشباب', icon: '👩', severity: 'common', rxcui: '19768' },
                { en: 'Eczema', ar: 'الإكزيما', icon: '🖐️', severity: 'chronic', rxcui: '19768' },
                { en: 'Psoriasis', ar: 'الصدفية', icon: '🖐️', severity: 'chronic', rxcui: '19768' },
                { en: 'Rosacea', ar: 'الوردية', icon: '👩', severity: 'chronic', rxcui: '19768' },
                { en: 'Hives', ar: 'الشرى', icon: '🔴', severity: 'acute', rxcui: '19768' },
                { en: 'Shingles', ar: 'الهربس النطاقي', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Herpes', ar: 'الهربس', icon: '🦠', severity: 'chronic', rxcui: '19768' },
                { en: 'Warts', ar: 'الثآليل', icon: '🦠', severity: 'common', rxcui: '19768' },
                { en: 'Fungal Infection', ar: 'عدوى فطرية', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Bacterial Infection', ar: 'عدوى بكتيرية', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Vitiligo', ar: 'البهاق', icon: '🤍', severity: 'chronic', rxcui: '19768' },
                { en: 'Melanoma', ar: 'الميلانوما', icon: '🖤', severity: 'chronic', rxcui: '19768' },
                { en: 'Basal Cell Carcinoma', ar: 'سرطان الخلايا القاعدية', icon: '🖤', severity: 'chronic', rxcui: '19768' },
                { en: 'Squamous Cell Carcinoma', ar: 'سرطان الخلايا الحرشفية', icon: '🖤', severity: 'chronic', rxcui: '19768' },
                { en: 'Alopecia', ar: 'الثعلبة', icon: '👨‍🦲', severity: 'chronic', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Mental Health', ar: 'الصحة النفسية' },
            conditions: [
                { en: 'Depression', ar: 'الاكتئاب', icon: '😔', severity: 'chronic', rxcui: '19768' },
                { en: 'Anxiety', ar: 'القلق', icon: '😨', severity: 'chronic', rxcui: '19768' },
                { en: 'Bipolar Disorder', ar: 'الاضطراب ثنائي القطب', icon: '😃😔', severity: 'chronic', rxcui: '19768' },
                { en: 'Schizophrenia', ar: 'الفصام', icon: '👥', severity: 'chronic', rxcui: '19768' },
                { en: 'OCD', ar: 'الوسواس القهري', icon: '🔁', severity: 'chronic', rxcui: '19768' },
                { en: 'PTSD', ar: 'اضطراب ما بعد الصدمة', icon: '💥', severity: 'chronic', rxcui: '19768' },
                { en: 'ADHD', ar: 'اضطراب فرط الحركة ونقص الانتباه', icon: '🧠', severity: 'chronic', rxcui: '19768' },
                { en: 'Autism', ar: 'التوحد', icon: '🧩', severity: 'chronic', rxcui: '19768' },
                { en: 'Eating Disorders', ar: 'اضطرابات الأكل', icon: '🍽️', severity: 'chronic', rxcui: '19768' },
                { en: 'Insomnia', ar: 'الأرق', icon: '😴', severity: 'chronic', rxcui: '19768' },
                { en: 'Panic Disorder', ar: 'اضطراب الهلع', icon: '😱', severity: 'chronic', rxcui: '19768' },
                { en: 'Social Anxiety', ar: 'القلق الاجتماعي', icon: '👥', severity: 'chronic', rxcui: '19768' },
                { en: 'Borderline Personality Disorder', ar: 'اضطراب الشخصية الحدية', icon: '🌀', severity: 'chronic', rxcui: '19768' },
                { en: 'Dementia', ar: 'الخرف', icon: '🧓', severity: 'chronic', rxcui: '19768' },
                { en: 'Substance Abuse', ar: 'إدمان المواد', icon: '💊', severity: 'chronic', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Infectious Diseases', ar: 'الأمراض المعدية' },
            conditions: [
                { en: 'COVID-19', ar: 'كوفيد-19', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Influenza', ar: 'الإنفلونزا', icon: '🦠', severity: 'acute', rxcui: '5628' },
                { en: 'Common Cold', ar: 'الزكام', icon: '🤧', severity: 'common', rxcui: '198440' },
                { en: 'Tuberculosis', ar: 'السل', icon: '🦠', severity: 'chronic', rxcui: '11373' },
                { en: 'HIV/AIDS', ar: 'الإيدز', icon: '🦠', severity: 'chronic', rxcui: '19768' },
                { en: 'Hepatitis B', ar: 'التهاب الكبد ب', icon: '🦠', severity: 'chronic', rxcui: '19768' },
                { en: 'Hepatitis C', ar: 'التهاب الكبد سي', icon: '🦠', severity: 'chronic', rxcui: '19768' },
                { en: 'Malaria', ar: 'الملاريا', icon: '🦟', severity: 'acute', rxcui: '19768' },
                { en: 'Dengue Fever', ar: 'حمى الضنك', icon: '🦟', severity: 'acute', rxcui: '19768' },
                { en: 'Zika Virus', ar: 'فيروس زيكا', icon: '🦟', severity: 'acute', rxcui: '19768' },
                { en: 'Chikungunya', ar: 'شيكونغونيا', icon: '🦟', severity: 'acute', rxcui: '19768' },
                { en: 'Lyme Disease', ar: 'مرض لايم', icon: '🦟', severity: 'acute', rxcui: '19768' },
                { en: 'Syphilis', ar: 'الزهري', icon: '🦠', severity: 'chronic', rxcui: '19768' },
                { en: 'Gonorrhea', ar: 'السيلان', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Chlamydia', ar: 'الكلاميديا', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'UTI', ar: 'عدوى المسالك البولية', icon: '🚽', severity: 'acute', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Eye Conditions', ar: 'أمراض العيون' },
            conditions: [
                { en: 'Conjunctivitis', ar: 'التهاب الملتحمة', icon: '👁️', severity: 'acute', rxcui: '19768' },
                { en: 'Cataracts', ar: 'الساد', icon: '👁️', severity: 'chronic', rxcui: '19768' },
                { en: 'Glaucoma', ar: 'الزرق', icon: '👁️', severity: 'chronic', rxcui: '19768' },
                { en: 'Macular Degeneration', ar: 'التنكس البقعي', icon: '👁️', severity: 'chronic', rxcui: '19768' },
                { en: 'Diabetic Retinopathy', ar: 'اعتلال الشبكية السكري', icon: '👁️', severity: 'chronic', rxcui: '19768' },
                { en: 'Dry Eye Syndrome', ar: 'متلازمة العين الجافة', icon: '👁️', severity: 'chronic', rxcui: '19768' },
                { en: 'Stye', ar: 'شحاذ العين', icon: '👁️', severity: 'acute', rxcui: '19768' },
                { en: 'Blepharitis', ar: 'التهاب الجفن', icon: '👁️', severity: 'chronic', rxcui: '19768' },
                { en: 'Uveitis', ar: 'التهاب العنبية', icon: '👁️', severity: 'acute', rxcui: '19768' },
                { en: 'Retinal Detachment', ar: 'انفصال الشبكية', icon: '👁️', severity: 'acute', rxcui: '19768' },
                { en: 'Color Blindness', ar: 'عمى الألوان', icon: '🌈', severity: 'chronic', rxcui: '19768' },
                { en: 'Myopia', ar: 'قصر النظر', icon: '👓', severity: 'chronic', rxcui: '19768' },
                { en: 'Hyperopia', ar: 'طول النظر', icon: '👓', severity: 'chronic', rxcui: '19768' },
                { en: 'Astigmatism', ar: 'اللابؤرية', icon: '👓', severity: 'chronic', rxcui: '19768' },
                { en: 'Presbyopia', ar: 'قصو البصر', icon: '👓', severity: 'chronic', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Ear, Nose & Throat', ar: 'الأنف والأذن والحنجرة' },
            conditions: [
                { en: 'Ear Infection', ar: 'عدوى الأذن', icon: '👂', severity: 'acute', rxcui: '19768' },
                { en: 'Otitis Media', ar: 'التهاب الأذن الوسطى', icon: '👂', severity: 'acute', rxcui: '19768' },
                { en: 'Tinnitus', ar: 'طنين الأذن', icon: '🔔', severity: 'chronic', rxcui: '19768' },
                { en: 'Hearing Loss', ar: 'فقدان السمع', icon: '👂', severity: 'chronic', rxcui: '19768' },
                { en: 'Vertigo', ar: 'دوار', icon: '🌀', severity: 'acute', rxcui: '19768' },
                { en: 'Meniere\'s Disease', ar: 'مرض مينيير', icon: '🌀', severity: 'chronic', rxcui: '19768' },
                { en: 'Sinusitis', ar: 'التهاب الجيوب الأنفية', icon: '👃', severity: 'acute', rxcui: '19543' },
                { en: 'Allergic Rhinitis', ar: 'التهاب الأنف التحسسي', icon: '🌸', severity: 'chronic', rxcui: '9133' },
                { en: 'Deviated Septum', ar: 'انحراف الحاجز الأنفي', icon: '👃', severity: 'chronic', rxcui: '19768' },
                { en: 'Nasal Polyps', ar: 'زوائد أنفية', icon: '👃', severity: 'chronic', rxcui: '19768' },
                { en: 'Tonsillitis', ar: 'التهاب اللوزتين', icon: '👅', severity: 'acute', rxcui: '19768' },
                { en: 'Pharyngitis', ar: 'التهاب البلعوم', icon: '👄', severity: 'acute', rxcui: '19768' },
                { en: 'Laryngitis', ar: 'التهاب الحنجرة', icon: '🗣️', severity: 'acute', rxcui: '19768' },
                { en: 'Sleep Apnea', ar: 'انقطاع النفس النومي', icon: '😴', severity: 'chronic', rxcui: '19768' },
                { en: 'Hoarseness', ar: 'بحة الصوت', icon: '🗣️', severity: 'acute', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Urological', ar: 'أمراض المسالك البولية' },
            conditions: [
                { en: 'UTI', ar: 'عدوى المسالك البولية', icon: '🚽', severity: 'acute', rxcui: '19768' },
                { en: 'Kidney Stones', ar: 'حصوات الكلى', icon: '💎', severity: 'acute', rxcui: '19768' },
                { en: 'Bladder Stones', ar: 'حصوات المثانة', icon: '💎', severity: 'acute', rxcui: '19768' },
                { en: 'Prostatitis', ar: 'التهاب البروستاتا', icon: '👨', severity: 'acute', rxcui: '19768' },
                { en: 'BPH', ar: 'تضخم البروستاتا الحميد', icon: '👨', severity: 'chronic', rxcui: '19768' },
                { en: 'Erectile Dysfunction', ar: 'ضعف الانتصاب', icon: '👨', severity: 'chronic', rxcui: '19768' },
                { en: 'Incontinence', ar: 'سلس البول', icon: '🚽', severity: 'chronic', rxcui: '19768' },
                { en: 'Overactive Bladder', ar: 'فرط نشاط المثانة', icon: '🚽', severity: 'chronic', rxcui: '19768' },
                { en: 'Interstitial Cystitis', ar: 'التهاب المثانة الخلالي', icon: '🚽', severity: 'chronic', rxcui: '19768' },
                { en: 'Kidney Infection', ar: 'عدوى الكلى', icon: '🫀', severity: 'acute', rxcui: '19768' },
                { en: 'Nephritis', ar: 'التهاب الكلى', icon: '🫀', severity: 'acute', rxcui: '19768' },
                { en: 'Polycystic Kidney Disease', ar: 'الداء الكلوي متعدد الكيسات', icon: '🫀', severity: 'chronic', rxcui: '19768' },
                { en: 'Renal Failure', ar: 'فشل كلوي', icon: '🫀', severity: 'chronic', rxcui: '19768' },
                { en: 'Hematuria', ar: 'البيلة الدموية', icon: '🩸', severity: 'acute', rxcui: '19768' },
                { en: 'Proteinuria', ar: 'البيلة البروتينية', icon: '🥚', severity: 'chronic', rxcui: '19768' }
            ]
        },
        {
            category: { en: 'Reproductive Health', ar: 'الصحة الإنجابية' },
            conditions: [
                { en: 'PMS', ar: 'متلازمة ما قبل الطمث', icon: '🌸', severity: 'chronic', rxcui: '19768' },
                { en: 'Dysmenorrhea', ar: 'عسر الطمث', icon: '🌸', severity: 'chronic', rxcui: '19768' },
                { en: 'Endometriosis', ar: 'بطانة الرحم المهاجرة', icon: '🌸', severity: 'chronic', rxcui: '19768' },
                { en: 'PCOS', ar: 'متلازمة المبيض المتعدد الكيسات', icon: '🌸', severity: 'chronic', rxcui: '19768' },
                { en: 'Fibroids', ar: 'الأورام الليفية', icon: '🌸', severity: 'chronic', rxcui: '19768' },
                { en: 'Menopause', ar: 'انقطاع الطمث', icon: '👵', severity: 'chronic', rxcui: '19768' },
                { en: 'Infertility', ar: 'العقم', icon: '👶', severity: 'chronic', rxcui: '19768' },
                { en: 'Erectile Dysfunction', ar: 'ضعف الانتصاب', icon: '👨', severity: 'chronic', rxcui: '19768' },
                { en: 'Premature Ejaculation', ar: 'القذف المبكر', icon: '👨', severity: 'chronic', rxcui: '19768' },
                { en: 'STDs', ar: 'الأمراض المنقولة جنسياً', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'HPV', ar: 'فيروس الورم الحليمي البشري', icon: '🦠', severity: 'chronic', rxcui: '19768' },
                { en: 'Vaginitis', ar: 'التهاب المهبل', icon: '🌸', severity: 'acute', rxcui: '19768' },
                { en: 'Yeast Infection', ar: 'عدوى الخميرة', icon: '🦠', severity: 'acute', rxcui: '19768' },
                { en: 'Pelvic Inflammatory Disease', ar: 'مرض التهاب الحوض', icon: '🌸', severity: 'acute', rxcui: '19768' },
                { en: 'Ovarian Cysts', ar: 'تكيسات المبيض', icon: '🌸', severity: 'acute', rxcui: '19768' }
            ]
        }
    ];

    // Fetch drug information from RxNorm API
    const fetchRxNormData = async (rxcui) => {
        try {
            // Get all related drugs for the condition
            const drugsResponse = await fetch(`${RX_NORM_API_URL}/rxclass/classMembers.json?classId=${rxcui}&relaSource=MEDRT`);
            const drugsData = await drugsResponse.json();

            if (!drugsData || !drugsData.rxclassDrugMemberList) return null;

            const drugList = drugsData.rxclassDrugMemberList.map(drug => drug.minConcept);

            // Get detailed information for each drug
            const detailedDrugs = await Promise.all(drugList.map(async (drug) => {
                // Get brand names
                const brandsResponse = await fetch(`${RX_NORM_API_URL}/rxcui/${drug.rxcui}/related.json?tty=BN`);
                const brandsData = await brandsResponse.json();

                // Get drug interactions
                const interactionsResponse = await fetch(`${RX_NORM_API_URL}/rxcui/${drug.rxcui}/interaction.json`);
                const interactionsData = await interactionsResponse.json();

                // Get drug details
                const detailsResponse = await fetch(`${RX_NORM_API_URL}/rxcui/${drug.rxcui}/allProperties.json?prop=RxNorm%20Name,Synonyms,Indications,Dosage,Precautions,Side%20Effects`);
                const detailsData = await detailsResponse.json();

                return {
                    genericName: drug.name,
                    rxcui: drug.rxcui,
                    brands: brandsData.relatedGroup?.conceptGroup?.filter(g => g.tty === 'BN')?.[0]?.conceptProperties || [],
                    interactions: interactionsData.interactionTypeGroup?.[0]?.interactionType || [],
                    details: detailsData.propConceptGroup?.propConcept || []
                };
            }));

            return detailedDrugs;
        } catch (error) {
            console.error('Error fetching RxNorm data:', error);
            return null;
        }
    };

    // Parse medication data into structured format
    const parseMedicationData = (data) => {
        if (Array.isArray(data)) {
            // Data from RxNorm API
            const result = {
                'Brand Names': '',
                'Generic Names': '',
                'Forms Available': '',
                'Side Effects': '',
                'Dosages': '',
                'Contraindications': '',
                'Pregnancy Category': '',
                'Manufacturers': '',
                'Interactions': '',
                brandsByCountry: {},
                generics: [],
                forms: [],
                interactions: []
            };

            // Group data by generic name
            const groupedData = {};
            data.forEach(drug => {
                if (!groupedData[drug.genericName]) {
                    groupedData[drug.genericName] = {
                        brands: new Set(),
                        sideEffects: '',
                        dosage: '',
                        precautions: '',
                        interactions: []
                    };
                }

                // Add brands
                drug.brands.forEach(brand => {
                    groupedData[drug.genericName].brands.add(brand.name);
                });

                // Add details
                drug.details.forEach(detail => {
                    if (detail.propName === 'Side Effects') {
                        groupedData[drug.genericName].sideEffects = detail.propValue;
                    } else if (detail.propName === 'Dosage') {
                        groupedData[drug.genericName].dosage = detail.propValue;
                    } else if (detail.propName === 'Precautions') {
                        groupedData[drug.genericName].precautions = detail.propValue;
                    }
                });

                // Add interactions
                groupedData[drug.genericName].interactions = [
                    ...groupedData[drug.genericName].interactions,
                    ...drug.interactions
                ];
            });

            // Format the result
            result.generics = Object.keys(groupedData);
            result['Generic Names'] = result.generics.join('\n- ');

            // Group brands by country (simplified for demo)
            result.brandsByCountry = {
                'United States': Array.from(
                    new Set(Object.values(groupedData).flatMap(d => Array.from(d.brands))))
            };

            // Combine side effects
            result['Side Effects'] = Object.values(groupedData)
                .map(d => d.sideEffects)
                .filter(Boolean)
                .join('\n\n');

            // Combine dosages
            result['Dosages'] = Object.values(groupedData)
                .map(d => d.dosage)
                .filter(Boolean)
                .join('\n\n');

            // Combine precautions
            result['Contraindications'] = Object.values(groupedData)
                .map(d => d.precautions)
                .filter(Boolean)
                .join('\n\n');

            // Set forms (simplified)
            result.forms = ['Tablet', 'Capsule', 'Syrup', 'Injection'];
            result['Forms Available'] = result.forms.join('\n- ');

            // Set pregnancy category (simplified)
            result['Pregnancy Category'] = 'Consult your doctor before use during pregnancy';

            // Set manufacturers (simplified)
            result['Manufacturers'] = 'Various pharmaceutical companies';

            // Process interactions
            const allInteractions = Object.values(groupedData)
                .flatMap(d => d.interactions)
                .filter((v, i, a) => a.findIndex(t => (
                    t.comment === v.comment && t.minConcept[0].name === v.minConcept[0].name
                )) === i);

            result.interactions = allInteractions;
            result['Interactions'] = allInteractions
                .map(i => `${i.minConcept[0].name}: ${i.comment}`)
                .join('\n\n');

            return result;
        } else {
            // Original parsing for AI response
            const sections = data.split('**').filter(section => section.trim());
            const result = {};

            for (let i = 0; i < sections.length; i += 2) {
                if (sections[i + 1]) {
                    const key = sections[i].trim().replace(':', '');
                    result[key] = sections[i + 1].trim();
                }
            }

            if (result['Brand Names']) {
                result.brandsByCountry = {};
                const countryLines = result['Brand Names'].split('\n');
                countryLines.forEach(line => {
                    const match = line.match(/\*\*(.*?)\*\*:\s*(.*)/);
                    if (match) {
                        result.brandsByCountry[match[1]] = match[2].split(', ');
                    }
                });
            }

            if (result['Generic Names']) {
                result.generics = result['Generic Names'].split('\n-').filter(x => x).map(x => x.trim().replace('-', ''));
            }

            if (result['Forms Available']) {
                result.forms = result['Forms Available'].split('\n-').filter(x => x).map(x => x.trim());
            }

            return result;
        }
    };

    const fetchMedicationInfo = async () => {
        if (!selectedCondition) return;

        setLoading(true);
        setMedicationData(null);
        setParsedData({});

        try {
            // First try RxNorm API
            const condition = medicalConditions
                .flatMap(c => c.conditions)
                .find(c => c[language] === selectedCondition);

            if (condition?.rxcui) {
                const rxNormData = await fetchRxNormData(condition.rxcui);

                if (rxNormData) {
                    setMedicationData(rxNormData);
                    setParsedData(parseMedicationData(rxNormData));
                    setShowDetails(true);
                    setLoading(false);
                    return;
                }
            }

            // Fallback to AI API if RxNorm fails
            const response = await fetch(MEDICATION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    condition: selectedCondition,
                    language: language
                })
            });

            const data = await response.json();
            setMedicationData(data.response);
            setParsedData(parseMedicationData(data.response));
        } catch (error) {
            console.error('Error fetching medication data:', error);
            setMedicationData(language === 'en'
                ? 'Error connecting to medication databases'
                : 'خطأ في الاتصال بقواعد البيانات الدوائية');
        }

        setShowDetails(true);
        setLoading(false);
    };

    const generateMedicationReport = () => {
        if (!medicationData) return;

        const printContent = `
      <html>
        <head>
          <title>${language === 'en' ? 'Medication Report' : 'تقرير الأدوية'}</title>
          <style>
            body { font-family: Arial; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4ade80; padding-bottom: 15px; }
            .condition-info { margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px; }
            .section { margin-bottom: 20px; }
            .section-title { color: #3b82f6; font-size: 1.2em; margin-bottom: 10px; font-weight: bold; }
            .medication-card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 15px; margin-bottom: 15px; }
            .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background-color: #3b82f6; color: white; text-align: left; padding: 10px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .warning { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 15px 0; }
            .interaction { background: #fee2e2; padding: 10px; border-left: 4px solid #ef4444; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #3b82f6; font-size: 1.8em;">${language === 'en' ? 'MediScan+ Medication Report' : 'تقرير أدوية من ميديسكان+'}</h1>
            <p style="color: #64748b;">${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="condition-info">
            <h2 style="color: #1e293b; font-size: 1.4em;">${language === 'en' ? 'Condition:' : 'الحالة:'} <span style="color: #3b82f6;">${selectedCondition}</span></h2>
            <p>${medicalConditions
                .flatMap(c => c.conditions)
                .find(c => c[language] === selectedCondition)?.icon || ''}</p>
          </div>
          
          <div class="section">
            <div class="section-title">${language === 'en' ? 'Brand Names' : 'الأسماء التجارية'}</div>
            <div class="medication-card">
              ${Object.entries(parsedData.brandsByCountry || {}).map(([country, brands]) => `
                <p><strong>${country}:</strong> ${brands.join(', ')}</p>
              `).join('')}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${language === 'en' ? 'Generic Names' : 'الأسماء العلمية'}</div>
            <div class="medication-card">
              ${(parsedData.generics || []).join(', ')}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${language === 'en' ? 'Forms & Dosages' : 'الأشكال والجرعات'}</div>
            <div class="medication-card">
              <p><strong>${language === 'en' ? 'Available Forms:' : 'الأشكال المتاحة:'}</strong></p>
              <ul>
                ${(parsedData.forms || []).map(form => `<li>${form}</li>`).join('')}
              </ul>
              
              <p><strong>${language === 'en' ? 'Dosage Information:' : 'معلومات الجرعة:'}</strong></p>
              <p>${parsedData['Dosages'] || language === 'en' ? 'Consult your doctor for dosage information' : 'استشر طبيبك للحصول على معلومات الجرعة'}</p>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${language === 'en' ? 'Side Effects' : 'الآثار الجانبية'}</div>
            <div class="medication-card">
              ${parsedData['Side Effects']?.replace(/\n/g, '<br>') ||
            (language === 'en' ? 'No side effects data available' : 'لا تتوفر بيانات عن الآثار الجانبية')}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${language === 'en' ? 'Drug Interactions' : 'تفاعلات الأدوية'}</div>
            <div class="medication-card">
              ${parsedData.interactions?.length > 0 ?
                parsedData.interactions.map(interaction => `
                  <div class="interaction">
                    <p><strong>${interaction.minConcept[0].name}:</strong> ${interaction.comment}</p>
                  </div>
                `).join('') :
                (parsedData['Interactions']?.replace(/\n/g, '<br>') ||
                    (language === 'en' ? 'No interaction data available' : 'لا تتوفر بيانات عن التفاعلات'))}
            </div>
          </div>
          
          <div class="warning">
            <strong>${language === 'en' ? 'Important:' : 'هام:'}</strong> 
            ${language === 'en'
                ? 'This information is for educational purposes only. Always consult a healthcare professional before taking any medication.'
                : 'هذه المعلومات لأغراض تعليمية فقط. استشر دائمًا أخصائي رعاية صحية قبل تناول أي دواء.'}
          </div>
          
          <div class="footer">
            <p>${language === 'en'
                ? 'Generated by MediScan+ Pharmaceutical System using RxNorm API'
                : 'تم إنشاؤه بواسطة نظام ميديسكان+ الدوائي باستخدام RxNorm API'}</p>
          </div>
        </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    // Enhanced drug card component
    const DrugCard = ({ title, children, icon }) => (
        <div className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm hover:border-emerald-400/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
                {icon && <span className="text-2xl">{icon}</span>}
                <h3 className="text-lg font-semibold text-emerald-400">{title}</h3>
            </div>
            <div className="text-slate-300">
                {children}
            </div>
        </div>
    );

    // Country flag component
    const CountryFlag = ({ country }) => {
        const flags = {
            'United States': '🇺🇸',
            'United Kingdom': '🇬🇧',
            'Australia': '🇦🇺',
            'Canada': '🇨🇦',
            'Germany': '🇩🇪',
            'France': '🇫🇷',
            'Japan': '🇯🇵',
            'China': '🇨🇳',
            'India': '🇮🇳',
            'Saudi Arabia': '🇸🇦',
            'Egypt': '🇪🇬',
            'UAE': '🇦🇪'
        };

        return <span className="mr-2">{flags[country] || '🌐'}</span>;
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Sticky header */}
                    <header className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl mb-10 mt-[60px] border border-slate-700/50 shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button
                                onClick={() => router.push('/diagnosis')}
                                className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {language === 'en' ? 'Back to Diagnosis' : 'العودة إلى التشخيص'}
                            </button>

                            <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                {language === 'en' ? 'Pharmaceutical Database' : 'قاعدة البيانات الدوائية'}
                            </h1>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                                    className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base flex items-center gap-2"
                                >
                                    <span className="text-lg">{language === 'en' ? '🇸🇦' : '🇺🇸'}</span>
                                    {language === 'en' ? 'العربية' : 'English'}
                                </button>
                            </div>
                        </div>
                    </header>




                    {/* Main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Condition selector sidebar */}
                        <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 h-fit lg:sticky lg:top-24">
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={language === 'en' ? 'Search conditions...' : 'ابحث عن الحالات...'}
                                        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-white placeholder-slate-500"
                                    />
                                    <span className="absolute left-3 top-3.5 text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {medicalConditions.map((category, index) => (
                                    <div key={index} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
                                        <h3 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            {category.category[language]}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {category.conditions
                                                .filter(condition =>
                                                    condition.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    condition.ar.includes(searchTerm))
                                                .map((condition, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedCondition(condition[language])}
                                                        className={`p-2 rounded-lg flex flex-col items-center transition-all text-sm ${selectedCondition === condition[language]
                                                            ? 'bg-emerald-500/20 border border-emerald-400/50 shadow-lg shadow-emerald-500/10'
                                                            : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-700/50'
                                                            }`}
                                                    >
                                                        <span className="text-xl mb-1">{condition.icon}</span>
                                                        <span className="text-center">{condition[language]}</span>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main content area */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Selected condition panel */}
                            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-lg">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-300 mb-1">
                                            {language === 'en' ? 'Selected Condition' : 'الحالة المحددة'}
                                        </h2>
                                        {selectedCondition ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">
                                                    {medicalConditions
                                                        .flatMap(c => c.conditions)
                                                        .find(c => c[language] === selectedCondition)?.icon || '🩺'}
                                                </span>
                                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                                    {selectedCondition}
                                                </h1>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic">
                                                {language === 'en'
                                                    ? 'No condition selected'
                                                    : 'لم يتم اختيار حالة'}
                                            </p>
                                        )}
                                    </div>

                                    {selectedCondition && (
                                        <button
                                            onClick={fetchMedicationInfo}
                                            disabled={loading}
                                            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${loading
                                                ? 'bg-slate-700 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20'
                                                }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="loading-spinner"></div>
                                                    {language === 'en' ? 'Analyzing...' : 'جاري التحليل...'}
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {language === 'en' ? 'Get Medication Data' : 'الحصول على بيانات الدواء'}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {selectedCondition && !showDetails && (
                                    <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-dashed border-slate-700/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="mt-4 text-slate-400">
                                            {language === 'en'
                                                ? 'Click above to analyze medications for this condition'
                                                : 'انقر أعلاه لتحليل الأدوية لهذه الحالة'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Medication details */}
                            {showDetails && (
                                <div className="space-y-6">
                                    {/* Navigation tabs */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
                                        <div className="flex overflow-x-auto">
                                            {[
                                                { id: 'brands', en: 'Brand Names', ar: 'الأسماء التجارية' },
                                                { id: 'generics', en: 'Generic Names', ar: 'الأسماء العلمية' },
                                                { id: 'forms', en: 'Forms & Dosages', ar: 'الأشكال والجرعات' },
                                                { id: 'sideEffects', en: 'Side Effects', ar: 'الآثار الجانبية' },
                                                { id: 'manufacturers', en: 'Manufacturers', ar: 'الشركات المصنعة' },
                                                { id: 'interactions', en: 'Interactions', ar: 'التفاعلات' }
                                            ].map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                                        }`}
                                                >
                                                    {tab[language]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Loading state */}
                                    {loading && (
                                        <div className="text-center py-16 bg-slate-900/30 rounded-lg">
                                            <div className="loading-spinner mx-auto mb-4"></div>
                                            <p className="text-slate-400">
                                                {language === 'en'
                                                    ? 'Analyzing pharmaceutical data...'
                                                    : 'جاري تحليل البيانات الدوائية...'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Content area */}
                                    {!loading && medicationData && (
                                        <div className="space-y-6">
                                            {/* Brands tab */}
                                            {activeTab === 'brands' && parsedData.brandsByCountry && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(parsedData.brandsByCountry).map(([country, brands]) => (
                                                        <DrugCard
                                                            key={country}
                                                            title={country}
                                                            icon={<CountryFlag country={country} />}
                                                        >
                                                            <ul className="space-y-2">
                                                                {brands.map((brand, i) => (
                                                                    <li key={i} className="flex items-center gap-2">
                                                                        <span className="text-emerald-400">•</span>
                                                                        <span>{brand}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </DrugCard>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Generics tab */}
                                            {activeTab === 'generics' && parsedData.generics && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {parsedData.generics.map((generic, i) => (
                                                        <DrugCard
                                                            key={i}
                                                            title={generic}
                                                            icon="🧪"
                                                        >
                                                            <div className="text-sm text-slate-400 mt-2">
                                                                {language === 'en'
                                                                    ? 'Generic active ingredient'
                                                                    : 'المكون النشط العام'}
                                                            </div>
                                                        </DrugCard>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Forms & Dosages tab */}
                                            {activeTab === 'forms' && (
                                                <div className="grid grid-cols-1 gap-4">
                                                    <DrugCard title={language === 'en' ? 'Available Forms' : 'الأشكال المتاحة'} icon="💊">
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {parsedData.forms?.map((form, i) => (
                                                                <span key={i} className="px-3 py-1 bg-slate-700/50 rounded-full text-sm">
                                                                    {form}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </DrugCard>

                                                    <DrugCard title={language === 'en' ? 'Dosage Information' : 'معلومات الجرعة'} icon="📊">
                                                        <div className="whitespace-pre-line mt-3">
                                                            {parsedData['Dosages'] || (
                                                                language === 'en'
                                                                    ? 'Consult your doctor for dosage information'
                                                                    : 'استشر طبيبك للحصول على معلومات الجرعة'
                                                            )}
                                                        </div>
                                                    </DrugCard>
                                                </div>
                                            )}

                                            {/* Side Effects tab */}
                                            {activeTab === 'sideEffects' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <DrugCard
                                                        title={language === 'en' ? 'Common Side Effects' : 'الآثار الجانبية الشائعة'}
                                                        icon="⚠️"
                                                    >
                                                        <div className="whitespace-pre-line mt-3">
                                                            {parsedData['Side Effects'] || (
                                                                language === 'en'
                                                                    ? 'No side effects data available'
                                                                    : 'لا تتوفر بيانات عن الآثار الجانبية'
                                                            )}
                                                        </div>
                                                    </DrugCard>

                                                    <DrugCard
                                                        title={language === 'en' ? 'Precautions' : 'الاحتياطات'}
                                                        icon="🚨"
                                                    >
                                                        <div className="whitespace-pre-line mt-3">
                                                            {parsedData['Contraindications'] || (
                                                                language === 'en'
                                                                    ? 'No precautions data available'
                                                                    : 'لا تتوفر بيانات عن الاحتياطات'
                                                            )}
                                                        </div>
                                                    </DrugCard>
                                                </div>
                                            )}

                                            {/* Manufacturers tab */}
                                            {activeTab === 'manufacturers' && (
                                                <DrugCard
                                                    title={language === 'en' ? 'Manufacturers' : 'الشركات المصنعة'}
                                                    icon="🏭"
                                                >
                                                    <div className="whitespace-pre-line mt-3">
                                                        {parsedData['Manufacturers'] || (
                                                            language === 'en'
                                                                ? 'Various pharmaceutical companies'
                                                                : 'شركات أدوية مختلفة'
                                                        )}
                                                    </div>
                                                </DrugCard>
                                            )}

                                            {/* Interactions tab */}
                                            {activeTab === 'interactions' && (
                                                <DrugCard
                                                    title={language === 'en' ? 'Drug Interactions & Warnings' : 'تفاعلات الأدوية والتحذيرات'}
                                                    icon="⚡"
                                                >
                                                    <div className="space-y-4 mt-3">
                                                        {parsedData.interactions?.length > 0 ? (
                                                            parsedData.interactions.map((interaction, i) => (
                                                                <div key={i} className="bg-slate-900/50 p-3 rounded-lg border-l-4 border-rose-500">
                                                                    <h4 className="font-medium text-rose-400">
                                                                        {interaction.minConcept[0].name}
                                                                    </h4>
                                                                    <p className="mt-1">{interaction.comment}</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="whitespace-pre-line">
                                                                {parsedData['Interactions'] || (
                                                                    language === 'en'
                                                                        ? 'No interaction data available'
                                                                        : 'لا تتوفر بيانات عن التفاعلات'
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </DrugCard>
                                            )}

                                            {/* Report generation */}
                                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                                    <div>
                                                        <h3 className="font-medium text-slate-300">
                                                            {language === 'en'
                                                                ? 'Generate a comprehensive medication report'
                                                                : 'إنشاء تقرير دوائي شامل'}
                                                        </h3>
                                                        <p className="text-sm text-slate-500">
                                                            {language === 'en'
                                                                ? 'Includes all details in a printable format'
                                                                : 'يتضمن جميع التفاصيل بتنسيق قابل للطباعة'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={generateMedicationReport}
                                                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {language === 'en' ? 'Generate Report' : 'إنشاء تقرير'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
      `}</style>
            </div>
        </>
    );
}