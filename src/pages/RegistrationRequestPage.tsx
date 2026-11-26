import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { GradeLevel } from '../types';
import { 
  insertRegistrationRequest, 
  getSupabaseCredentials, 
  saveSupabaseCredentials,
  getSupabaseClient 
} from '../lib/supabase';
import { 
  CheckCircle, 
  Send, 
  School, 
  Phone, 
  Mail, 
  User, 
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Database,
  RotateCcw,
  Settings,
  X,
  Copy,
  ExternalLink,
  Globe,
  Laptop,
  Building2
} from 'lucide-react';

interface RegistrationRequestPageProps {
  navigate: (path: string) => void;
}

export const RegistrationRequestPage: React.FC<RegistrationRequestPageProps> = ({ navigate }) => {
  const { submitRegistrationRequest } = useData();
  const { language } = useLanguage();
  const isSi = language === 'si';

  // Form Fields:
  // 1. student_name (Required)
  // 2. parent_name
  // 3. mobile (Required)
  // 4. class_type (Required: 'Online' | 'Physical')
  // 5. email (Optional)
  // 6. school_name
  // 7. current_grade
  // 8. medium (Required: 'Sinhala' | 'English')
  // 9. preferred_batch (Required)
  // 10. additional_notes
  const [fullName, setFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [classType, setClassType] = useState<'Online' | 'Physical' | ''>('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(10);
  const [medium, setMedium] = useState('');
  const [preferredClass, setPreferredClass] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionErrorCode, setSubmissionErrorCode] = useState<string | null>(null);
  const [savedSummary, setSavedSummary] = useState<{
    studentName: string;
    grade: GradeLevel;
    classType: string;
    medium: string;
    preferredBatch: string;
    mobile: string;
    savedToSupabase: boolean;
  } | null>(null);

  // Supabase Configuration Status & Modal
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');
  const [configSaveMsg, setConfigSaveMsg] = useState('');
  const [copiedMigration, setCopiedMigration] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Sync Supabase credentials status on mount
  useEffect(() => {
    const creds = getSupabaseCredentials();
    setIsConfigured(creds.isConfigured);
    setConfigUrl(creds.url);
    setConfigKey(creds.anonKey);
  }, []);

  const handleSaveConfig = () => {
    saveSupabaseCredentials(configUrl, configKey);
    const updated = getSupabaseCredentials();
    setIsConfigured(updated.isConfigured);
    setConfigUrl(updated.url);
    setConfigKey(updated.anonKey);
    setConfigSaveMsg(
      updated.isConfigured
        ? isSi
          ? '✓ Supabase සම්බන්ධතා තොරතුරු සාර්ථකව සුරකින ලදී!'
          : '✓ Supabase credentials configured successfully!'
        : isSi
          ? 'තොරතුරු සුරකින ලදී (කරුණාකර URL ආකෘතිය පරීක්ෂා කරන්න)'
          : 'Credentials saved (please verify URL format)'
    );
    setTimeout(() => setConfigSaveMsg(''), 4000);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        setConnectionTestResult({
          ok: false,
          msg: isSi
            ? 'Supabase සම්බන්ධතාවය ආරම්භ කළ නොහැක. කරුණාකර URL සහ Anon Key පරීක්ෂා කරන්න.'
            : 'Supabase client could not be initialized. Please check URL and Anon Key.',
        });
        return;
      }
      const { error } = await client
        .from('registration_requests')
        .select('count', { count: 'exact', head: true });

      if (!error) {
        setConnectionTestResult({
          ok: true,
          msg: isSi
            ? '✓ public.registration_requests වගුව වෙත සාර්ථකව සම්බන්ධ විය!'
            : '✓ Successfully connected to public.registration_requests table!',
        });
      } else if (error.code === '42501') {
        setConnectionTestResult({
          ok: true,
          msg: isSi
            ? '✓ Supabase වෙත සම්බන්ධ විය! RLS ආරක්ෂාව සමඟ වගුව ක්‍රියාත්මකයි.'
            : '✓ Connected to Supabase! Table public.registration_requests is reachable with RLS enabled.',
        });
      } else if (error.code === '42P01') {
        setConnectionTestResult({
          ok: false,
          msg: isSi
            ? 'public.registration_requests වගුව නොමැත. කරුණාකර Supabase SQL Editor හි migration script එක ක්‍රියාත්මක කරන්න.'
            : 'Table public.registration_requests does not exist. Please run the migration SQL script in your Supabase SQL Editor.',
        });
      } else {
        setConnectionTestResult({ ok: false, msg: `Supabase returned: [${error.code}] ${error.message}` });
      }
    } catch (err: any) {
      setConnectionTestResult({ ok: false, msg: err.message || 'Connection test failed.' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Validation rules
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPhone = (val: string) => val.replace(/[^0-9]/g, '').length >= 9;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    setValidationError('');
    setSubmissionError('');
    setSubmissionErrorCode(null);

    // 1. Validate required fields before submission
    if (!fullName.trim()) {
      setValidationError(
        isSi
          ? 'කරුණාකර ශිෂ්‍යයාගේ සම්පූර්ණ නම ඇතුළත් කරන්න.'
          : 'Please enter the student\'s full name.'
      );
      return;
    }
    if (fullName.trim().length < 3) {
      setValidationError(
        isSi
          ? 'ශිෂ්‍යයාගේ නම අවම වශයෙන් අක්ෂර 3ක්වත් විය යුතුය.'
          : 'Student name must be at least 3 characters.'
      );
      return;
    }
    if (!studentMobile.trim()) {
      setValidationError(
        isSi
          ? 'කරුණාකර ශිෂ්‍යයාගේ ජංගම / WhatsApp දුරකථන අංකය ඇතුළත් කරන්න.'
          : 'Please enter a student mobile / WhatsApp number.'
      );
      return;
    }
    if (!isValidPhone(studentMobile)) {
      setValidationError(
        isSi
          ? 'කරුණාකර වලංගු ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (අවම වශයෙන් ඉලක්කම් 9–10).'
          : 'Please enter a valid student mobile number (at least 9-10 digits).'
      );
      return;
    }
    if (!classType) {
      setValidationError(
        isSi
          ? 'කරුණාකර පන්ති වර්ගය (Online හෝ Physical) තෝරන්න.'
          : 'Please select a class type (Online or Physical).'
      );
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      setValidationError(
        isSi
          ? 'කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න (උදා: student@gmail.com).'
          : 'Please enter a valid email address (e.g. student@gmail.com).'
      );
      return;
    }
    if (!medium.trim()) {
      setValidationError(
        isSi
          ? 'කරුණාකර ඉගෙනුම් මාධ්‍යය (සිංහල හෝ ඉංග්‍රීසි) තෝරන්න.'
          : 'Please select a study medium (Sinhala or English).'
      );
      return;
    }
    if (!preferredClass.trim()) {
      setValidationError(
        isSi
          ? 'කරුණාකර වඩාත් කැමති පන්ති වේලාව සහ කණ්ඩායම තෝරන්න.'
          : 'Please select your preferred class time & batch.'
      );
      return;
    }

    setIsSubmitting(true);

    // Prepare payload (excludes parent_mobile from form submission)
    const nowIso = new Date().toISOString();
    const payload = {
      student_name: fullName.trim(),
      parent_name: parentName.trim() || null,
      mobile: studentMobile.trim(),
      class_type: classType,
      email: email.trim() ? email.trim().toLowerCase() : null,
      school_name: schoolName.trim() || null,
      current_grade: String(currentGrade),
      requested_grade: Number(currentGrade),
      medium: medium.trim(),
      preferred_batch: preferredClass.trim(),
      additional_notes: additionalMessage.trim() || null,
      status: 'pending',
      created_at: nowIso,
    };

    try {
      const supabaseResult = await insertRegistrationRequest(payload);

      if (!supabaseResult.success) {
        setSubmissionError(
          supabaseResult.error ||
            (isSi
              ? 'Supabase දත්ත ගබඩාව වෙත ලියාපදිංචිය සුරැකීමට අසමත් විය.'
              : 'Failed to insert registration into Supabase.')
        );
        setSubmissionErrorCode(supabaseResult.errorCode || null);
        return;
      }

      // Sync local context for instant LMS admin portal display
      submitRegistrationRequest({
        studentFullName: fullName.trim(),
        parentName: parentName.trim() || 'Not specified',
        studentMobile: studentMobile.trim(),
        classType,
        email: email.trim() ? email.trim().toLowerCase() : '',
        schoolName: schoolName.trim() || 'School in Sri Lanka',
        currentGrade,
        requestedGrade: currentGrade,
        medium: medium.trim(),
        academicYear: '2026',
        preferredClass: preferredClass.trim(),
        additionalMessage: additionalMessage.trim(),
        student_name: fullName.trim(),
        mobile: studentMobile.trim(),
        class_type: classType,
        preferred_batch: preferredClass.trim(),
        additional_notes: additionalMessage.trim(),
      });

      setSavedSummary({
        studentName: fullName.trim(),
        grade: currentGrade,
        classType,
        medium: medium.trim(),
        preferredBatch: preferredClass.trim(),
        mobile: studentMobile.trim(),
        savedToSupabase: true,
      });

      // Reset form fields after confirmed successful submission
      setFullName('');
      setParentName('');
      setStudentMobile('');
      setClassType('');
      setEmail('');
      setSchoolName('');
      setMedium('');
      setPreferredClass('');
      setAdditionalMessage('');
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmissionError(
        err.message ||
          (isSi
            ? 'දත්ත යොමු කිරීමේදී අනපේක්ෂිත දෝෂයක් ඇති විය.'
            : 'An unexpected error occurred during Supabase submission.')
      );
      setSubmissionErrorCode('UNEXPECTED');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSavedSummary(null);
    setValidationError('');
    setSubmissionError('');
    setSubmissionErrorCode(null);
  };

  const copySqlMigration = () => {
    const sql = `-- ICT Hemantha LMS: Add class_type & medium columns & refresh PostgREST schema cache
-- 1. Add missing columns non-destructively (preserves all existing columns and records)
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS class_type TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS medium TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS current_grade TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS preferred_batch TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- 2. Ensure Row Level Security allows public student submissions
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public registration insert" ON public.registration_requests;
CREATE POLICY "Allow public registration insert" 
ON public.registration_requests 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 3. Instantly refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';`;

    navigator.clipboard.writeText(sql);
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 3000);
  };

  const getLocalizedBatch = (val: string) => {
    if (!isSi) return val;
    switch (val) {
      case 'Saturday Morning':
        return 'සෙනසුරාදා උදෑසන (Saturday Morning)';
      case 'Saturday Evening':
        return 'සෙනසුරාදා සවස (Saturday Evening)';
      case 'Other':
        return 'වෙනත් (Other)';
      case 'Online':
        return 'මාර්ගගත පන්ති (Online)';
      default:
        return val;
    }
  };

  const getLocalizedMedium = (val: string) => {
    if (!isSi) return val;
    if (val === 'Sinhala') return 'සිංහල (Sinhala)';
    if (val === 'English') return 'ඉංග්‍රීසි (English)';
    return val;
  };

  const getLocalizedClassType = (val: string) => {
    if (!isSi) return val;
    if (val === 'Online') return 'මාර්ගගත (Online)';
    if (val === 'Physical') return 'භෞතික පන්ති (Physical)';
    return val;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* SUCCESS STATE - Shown ONLY after Supabase confirms successful insertion */}
      {isSubmitted && savedSummary ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xl space-y-5 animate-in fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isSi
                  ? 'ලියාපදිංචිය සාර්ථකව සුරකින ලදී (Supabase)'
                  : 'Confirmed Saved to Supabase Table: registration_requests'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4A]">
              {isSi ? `ස්තූතියි, ${savedSummary.studentName}!` : `Thank You, ${savedSummary.studentName}!`}
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto font-sinhala leading-relaxed">
              {isSi
                ? `ඔබගේ ${savedSummary.grade} ශ්‍රේණිය ICT පන්ති ලියාපදිංචි ඉල්ලීම සාර්ථකව Supabase දත්ත ගබඩාව වෙත ලැබිණි. අපගේ පරිපාලන කණ්ඩායම WhatsApp හෝ දුරකථන මාර්ගයෙන් කෙටි වේලාවකින් ඔබව සම්බන්ධ කරගනු ඇත.`
                : `Your Grade ${savedSummary.grade} ICT registration request has been saved to our database. Our academic coordinator will contact you shortly via WhatsApp or phone to confirm your enrollment.`}
            </p>
          </div>

          <div className="bg-[#EAF3FC] rounded-2xl p-4 text-xs text-[#0B1F4A] max-w-md mx-auto space-y-1.5 text-left border border-[#2563A6]/20">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">{isSi ? 'ශ්‍රේණිය:' : 'Grade:'}</span>
              <span className="font-bold">
                {isSi ? `${savedSummary.grade} ශ්‍රේණිය ICT` : `Grade ${savedSummary.grade} ICT`}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">{isSi ? 'පන්ති වර්ගය:' : 'Class Type:'}</span>
              <span className="font-bold">{getLocalizedClassType(savedSummary.classType)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">{isSi ? 'මාධ්‍යය:' : 'Medium:'}</span>
              <span className="font-bold">{getLocalizedMedium(savedSummary.medium)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">
                {isSi ? 'පන්ති වේලාව සහ කණ්ඩායම:' : 'Preferred Class Time & Batch:'}
              </span>
              <span className="font-bold text-right">{getLocalizedBatch(savedSummary.preferredBatch)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">{isSi ? 'දුරකථන අංකය:' : 'Contact Number:'}</span>
              <span className="font-mono font-bold">{savedSummary.mobile}</span>
            </div>
            <div className="flex justify-between gap-2 border-t border-[#2563A6]/10 pt-1.5">
              <span className="text-slate-500">{isSi ? 'දත්ත ගබඩාව:' : 'Supabase Record:'}</span>
              <span className="font-semibold text-emerald-700">
                {isSi ? '✓ සාර්ථකව ඇතුළත් කරන ලදී' : '✓ Verified inserted into public.registration_requests'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/94772735518?text=${encodeURIComponent(`Hello Hemantha Sir, I submitted a registration request for Grade ${savedSummary.grade} ICT (${savedSummary.classType} - ${savedSummary.medium} Medium, ${savedSummary.preferredBatch}). Student: ${savedSummary.studentName}, Mobile: ${savedSummary.mobile}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <span>
                {isSi ? 'WhatsApp මගින් තහවුරු කරන්න (0772735518)' : 'Verify on WhatsApp (0772735518)'}
              </span>
            </a>
            <button
              onClick={handleResetForm}
              className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSi ? 'තවත් ලියාපදිංචියක් යොමු කරන්න' : 'Submit Another Registration'}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#0B1F4A] hover:bg-[#163675] text-white text-xs font-bold rounded-xl"
            >
              {isSi ? 'මුල් පිටුවට යන්න' : 'Return to Home'}
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0B1F4A] text-white p-6 sm:p-10 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F58220] text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isSi ? '2026 අධ්‍යයන වර්ෂය සඳහා බඳවා ගැනීම්' : 'Academic Year 2026 Admissions'}
                </span>
              </div>

              {/* Supabase Connection Status Badge with interactive config trigger */}
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                  isConfigured 
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-200 border-amber-400/30 hover:bg-amber-500/30'
                }`}
                title={isSi ? 'Supabase සැකසුම් පරීක්ෂා කරන්න' : 'View Supabase connection status & settings'}
              >
                <Database className={`w-3 h-3 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>
                  {isConfigured
                    ? isSi ? 'Supabase සම්බන්ධයි' : 'Supabase Connected'
                    : isSi ? 'Supabase සකසන්න' : 'Configure Supabase'}
                </span>
                <Settings className="w-3 h-3 opacity-70" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isSi
                ? '6–11 ශ්‍රේණි ICT පන්ති ලියාපදිංචි ඉල්ලීම'
                : 'Grade 6–11 ICT Class Registration Request'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sinhala leading-relaxed">
              {isSi
                ? 'හේමන්ත වන්නිනායක (B.Sc) ICT ඇකඩමියේ නව පන්ති සඳහා අදම ආසනයක් වෙන්කරවා ගන්න.'
                : 'Reserve your seat today for Grade 6–11 ICT classes conducted by Hemantha Wanninayake B.Sc.'}
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-6">
            
            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actual Supabase Error Banner */}
            {submissionError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2 animate-in fade-in">
                <div className="font-bold flex items-center justify-between text-red-900">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      {isSi ? 'Supabase දත්ත ගබඩා දෝෂය' : 'Supabase Database Error'}{' '}
                      {submissionErrorCode ? `(${submissionErrorCode})` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(true)}
                    className="text-[11px] underline text-red-700 hover:text-red-900 font-semibold"
                  >
                    {isSi ? 'සැකසුම් පරීක්ෂා කරන්න' : 'Check Supabase Settings'}
                  </button>
                </div>
                <p className="text-[11px] text-red-700 leading-relaxed font-mono bg-red-100/60 p-2.5 rounded-lg border border-red-200">
                  {submissionError}
                </p>
                {submissionErrorCode === 'NOT_CONFIGURED' && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      className="px-3 py-1.5 bg-[#0B1F4A] text-white text-[11px] font-bold rounded-lg hover:bg-[#163675]"
                    >
                      {isSi ? 'Supabase URL සහ යතුර ඇතුළත් කරන්න' : 'Enter Supabase URL & Anon Key'}
                    </button>
                  </div>
                )}

                {(submissionErrorCode === 'PGRST204' || 
                  submissionErrorCode === '42703' || 
                  submissionErrorCode === '42501' || 
                  submissionError.includes('schema cache') || 
                  submissionError.includes('class_type') || 
                  submissionError.includes('medium') || 
                  submissionError.includes('additional_notes') || 
                  submissionError.includes('row-level security')) && (
                  <div className="pt-2 mt-2 border-t border-red-200/80 space-y-2">
                    <div className="text-[11px] font-bold text-red-900 flex items-center gap-1.5">
                      <span>
                        {isSi
                          ? '⚡ දත්ත ගබඩා තීරු සහ RLS යාවත්කාලීන කිරීමට පහත SQL කේතය ක්‍රියාත්මක කරන්න:'
                          : '⚡ SQL Migration Required to Add Missing Columns & RLS:'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto">
                      <code>
                        ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS class_type TEXT;<br />
                        ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS medium TEXT;<br />
                        ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS current_grade TEXT;<br />
                        ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS preferred_batch TEXT;<br />
                        ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS additional_notes TEXT;<br />
                        NOTIFY pgrst, 'reload schema';
                      </code>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={copySqlMigration}
                        className="px-3.5 py-1.5 bg-[#0B1F4A] hover:bg-[#163675] text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>
                          {copiedMigration
                            ? isSi ? '✓ SQL පිටපත් කරන ලදී!' : '✓ Copied SQL Migration!'
                            : isSi ? 'SQL Migration පිටපත් කරන්න' : 'Copy SQL Migration Script'}
                        </span>
                      </button>
                      <a
                        href="https://supabase.com/dashboard/project/tpehwhydacaicalhayft/sql"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-300 shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#F58220]" />
                        <span>{isSi ? 'Supabase SQL Editor විවෘත කරන්න' : 'Open Supabase SQL Editor'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Student Name (student_name) - Required */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'ශිෂ්‍යයාගේ සම්පූර්ණ නම' : 'Student Name'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isSi ? 'උදා: මලිත් සන්දීප බණ්ඩාර' : 'e.g. Malith Sandeepa Bandara'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 2. Parents Name (parent_name) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'දෙමාපියන්ගේ නම' : 'Parents Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={isSi ? 'උදා: සුනිල් බණ්ඩාර' : 'e.g. Sunil Bandara'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 3. Student Mobile / WhatsApp (mobile) - Required */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'ශිෂ්‍යයාගේ ජංගම / WhatsApp අංකය' : 'Student Mobile / WhatsApp'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    disabled={isSubmitting}
                    value={studentMobile}
                    onChange={(e) => setStudentMobile(e.target.value)}
                    placeholder={isSi ? '077 123 4567' : '077 123 4567'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 4. Class Type (class_type) - Required: Online / Physical */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'පන්ති වර්ගය' : 'Class Type'} <span className="text-red-500">*</span>
                </label>
                <div
                  role="radiogroup"
                  aria-label={isSi ? 'පන්ති වර්ගය' : 'Class Type'}
                  className="grid grid-cols-2 gap-3"
                >
                  {(['Online', 'Physical'] as const).map((option) => {
                    const selected = classType === option;
                    const Icon = option === 'Online' ? Laptop : Building2;
                    return (
                      <label
                        key={option}
                        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                          isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                        } ${
                          selected
                            ? 'bg-[#0B1F4A] text-white border-[#F58220] ring-2 ring-[#F58220]/30 shadow-md'
                            : 'bg-slate-50 text-[#0B1F4A] border-slate-300 hover:border-[#2563A6] hover:bg-[#EAF3FC]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="class_type"
                          value={option}
                          checked={selected}
                          disabled={isSubmitting}
                          onChange={() => setClassType(option)}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            selected
                              ? 'border-[#F58220] bg-[#F58220]/20'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-[#F58220]" />}
                        </span>
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            selected ? 'text-[#F58220]' : 'text-[#2563A6]'
                          }`}
                        />
                        <span className="truncate">
                          {option === 'Online'
                            ? isSi ? 'මාර්ගගත (Online)' : 'Online'
                            : isSi ? 'භෞතික (Physical)' : 'Physical'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. Email Address (email) - Optional */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'විද්‍යුත් තැපැල් ලිපිනය (විකල්ප)' : 'Email Address (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isSi ? 'student@example.com (විකල්ප)' : 'student@example.com (optional)'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 6. School Name (school_name) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'පාසලේ නම' : 'School Name'}
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder={isSi ? 'උදා: මලියදේව විද්‍යාලය / රාජකීය විද්‍යාලය' : 'e.g. Royal College Colombo / Maliyadeva'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 7. Current Grade in School (current_grade) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'පාසලේ වත්මන් ශ්‍රේණිය' : 'Current Grade in School'}
                </label>
                <select
                  disabled={isSubmitting}
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value={6}>{isSi ? '6 ශ්‍රේණිය (Grade 6)' : 'Grade 6'}</option>
                  <option value={7}>{isSi ? '7 ශ්‍රේණිය (Grade 7)' : 'Grade 7'}</option>
                  <option value={8}>{isSi ? '8 ශ්‍රේණිය (Grade 8)' : 'Grade 8'}</option>
                  <option value={9}>{isSi ? '9 ශ්‍රේණිය (Grade 9)' : 'Grade 9'}</option>
                  <option value={10}>{isSi ? '10 ශ්‍රේණිය (Grade 10)' : 'Grade 10'}</option>
                  <option value={11}>{isSi ? '11 ශ්‍රේණිය (Grade 11)' : 'Grade 11'}</option>
                </select>
              </div>

              {/* 8. Medium (medium) - Required */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'ඉගෙනුම් මාධ්‍යය' : 'Medium'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    disabled={isSubmitting}
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {isSi ? 'මාධ්‍යය තෝරන්න' : 'Select Medium'}
                    </option>
                    <option value="Sinhala">
                      {isSi ? 'සිංහල (Sinhala)' : 'Sinhala'}
                    </option>
                    <option value="English">
                      {isSi ? 'ඉංග්‍රීසි (English)' : 'English'}
                    </option>
                  </select>
                </div>
              </div>

              {/* 9. Preferred Class Time & Batch (preferred_batch) - Required */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'වඩාත් කැමති පන්ති වේලාව සහ කණ්ඩායම' : 'Preferred Class Time & Batch'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    disabled={isSubmitting}
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {isSi ? 'පන්ති වේලාව සහ කණ්ඩායම තෝරන්න' : 'Select Preferred Class Time & Batch'}
                    </option>
                    <option value="Saturday Morning">
                      {isSi ? 'සෙනසුරාදා උදෑසන (Saturday Morning)' : 'Saturday Morning'}
                    </option>
                    <option value="Saturday Evening">
                      {isSi ? 'සෙනසුරාදා සවස (Saturday Evening)' : 'Saturday Evening'}
                    </option>
                    <option value="Other">
                      {isSi ? 'වෙනත් (Other)' : 'Other'}
                    </option>
                    <option value="Online">
                      {isSi ? 'මාර්ගගත පන්ති (Online)' : 'Online'}
                    </option>
                  </select>
                </div>
              </div>

              {/* 10. Additional Notes / Learning Goals (additional_notes) */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isSi ? 'අමතර සටහන් / ඉගෙනුම් ඉලක්ක' : 'Additional Notes / Learning Goals'}
                </label>
                <textarea
                  rows={3}
                  disabled={isSubmitting}
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder={
                    isSi
                      ? 'ඔබගේ ඉලක්කගත විභාග ලකුණු, විශේෂ විෂය කොටස් (උදා: Python, Flowcharts) හෝ විමසීම් සඳහන් කරන්න...'
                      : 'Tell us about your target examination score, any specific topics (e.g. Python, flowcharts), or queries...'
                  }
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] resize-none disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-slate-500 text-center sm:text-left">
                {isSi
                  ? '🔒 ඔබගේ තොරතුරු ආරක්ෂිතව Supabase දත්ත ගබඩාව වෙත යොමු කෙරේ.'
                  : '🔒 Direct insert into Supabase public.registration_requests with RLS.'}
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F58220] hover:bg-[#e07519] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {isSi ? 'ලියාපදිංචිය යොමු වෙමින් පවතී...' : 'Submitting Registration...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {isSi ? 'ලියාපදිංචි ඉල්ලීම යොමු කරන්න' : 'Submit Registration Request'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* SUPABASE CONNECTION SETTINGS MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden space-y-4">
            
            <div className="bg-[#0B1F4A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#F58220]" />
                <div>
                  <h3 className="text-sm font-bold">Supabase Database Connection</h3>
                  <p className="text-[11px] text-slate-300">Table: <code className="text-[#F58220]">public.registration_requests</code></p>
                </div>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                Configure your Supabase Project URL and Anon/Publishable Key. These can also be set in <code className="bg-slate-100 px-1 rounded text-[#0B1F4A] font-bold">.env</code> as <code className="text-xs font-mono">VITE_SUPABASE_URL</code> and <code className="text-xs font-mono">VITE_SUPABASE_ANON_KEY</code>.
              </div>

              {configSaveMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                  {configSaveMsg}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Supabase Anon / Publishable Key
                  </label>
                  <textarea
                    rows={2}
                    value={configKey}
                    onChange={(e) => setConfigKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] resize-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Never use service_role keys. Only anon/publishable keys are safe for client-side forms.
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2 bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold rounded-xl"
                >
                  Save Credentials
                </button>
                <button
                  type="button"
                  disabled={isTestingConnection}
                  onClick={handleTestConnection}
                  className="px-4 py-2 bg-[#0B1F4A] hover:bg-[#163675] disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {isTestingConnection ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Test Table Connection</span>
                </button>
                <button
                  type="button"
                  onClick={copySqlMigration}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedMigration ? '✓ Copied SQL!' : 'Copy Migration SQL'}</span>
                </button>
              </div>

              {connectionTestResult && (
                <div className={`p-3 rounded-xl text-xs font-medium border ${
                  connectionTestResult.ok 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {connectionTestResult.msg}
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
