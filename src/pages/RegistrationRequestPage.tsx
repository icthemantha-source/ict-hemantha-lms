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
  ExternalLink
} from 'lucide-react';

interface RegistrationRequestPageProps {
  navigate: (path: string) => void;
}

export const RegistrationRequestPage: React.FC<RegistrationRequestPageProps> = ({ navigate }) => {
  const { submitRegistrationRequest } = useData();
  const { language } = useLanguage();

  // Form Fields to Save (12 fields):
  // 1. student_name
  // 2. parent_name
  // 3. mobile (Student Mobile / WhatsApp)
  // 4. parent_mobile
  // 5. email
  // 6. school_name
  // 7. current_grade
  // 8. requested_grade
  // 9. preferred_batch
  // 10. additional_notes
  // 11. status
  // 12. created_at
  const [fullName, setFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(10);
  const [requestedGrade, setRequestedGrade] = useState<GradeLevel>(11);
  const [preferredClass, setPreferredClass] = useState('Sunday Morning Online Class (8:30 AM - 11:30 AM)');
  const [additionalMessage, setAdditionalMessage] = useState('');

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionErrorCode, setSubmissionErrorCode] = useState<string | null>(null);
  const [savedSummary, setSavedSummary] = useState<{
    studentName: string;
    requestedGrade: GradeLevel;
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
    setConfigSaveMsg(updated.isConfigured ? '✓ Supabase credentials configured successfully!' : 'Credentials saved (please verify URL format)');
    setTimeout(() => setConfigSaveMsg(''), 4000);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        setConnectionTestResult({ ok: false, msg: 'Supabase client could not be initialized. Please check URL and Anon Key.' });
        return;
      }
      // Check if registration_requests table exists and RLS allows access
      const { error } = await client
        .from('registration_requests')
        .select('count', { count: 'exact', head: true });

      if (!error) {
        setConnectionTestResult({ ok: true, msg: '✓ Successfully connected to public.registration_requests table!' });
      } else if (error.code === '42501') {
        // Table exists but RLS SELECT policy is restricted to admins (standard for public registration forms)
        setConnectionTestResult({ ok: true, msg: '✓ Connected to Supabase! Table public.registration_requests is reachable with RLS enabled.' });
      } else if (error.code === '42P01') {
        setConnectionTestResult({ ok: false, msg: `Table public.registration_requests does not exist. Please run the migration SQL script in your Supabase SQL Editor.` });
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
      setValidationError('Please enter the student\'s full name.');
      return;
    }
    if (fullName.trim().length < 3) {
      setValidationError('Student full name must be at least 3 characters.');
      return;
    }
    if (!studentMobile.trim()) {
      setValidationError('Please enter a student mobile / WhatsApp number.');
      return;
    }
    if (!isValidPhone(studentMobile)) {
      setValidationError('Please enter a valid student mobile number (at least 9-10 digits).');
      return;
    }
    if (parentMobile.trim() && !isValidPhone(parentMobile)) {
      setValidationError('Parent mobile number is invalid (must be at least 9-10 digits).');
      return;
    }
    if (!email.trim()) {
      setValidationError('Please enter an email address for registration confirmation.');
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address (e.g. student@gmail.com).');
      return;
    }

    setIsSubmitting(true);

    // Prepare payload with all 12 requested fields
    const nowIso = new Date().toISOString();
    const payload = {
      student_name: fullName.trim(),
      parent_name: parentName.trim() || null,
      mobile: studentMobile.trim(),
      parent_mobile: parentMobile.trim() || null,
      email: email.trim().toLowerCase(),
      school_name: schoolName.trim() || null,
      current_grade: Number(currentGrade),
      requested_grade: Number(requestedGrade),
      preferred_batch: preferredClass,
      additional_notes: additionalMessage.trim() || null,
      status: 'pending',
      created_at: nowIso,
    };

    try {
      // Connect and insert into Supabase database table `public.registration_requests`
      const supabaseResult = await insertRegistrationRequest(payload);

      // REQUIREMENT 8: Display a success message ONLY after Supabase confirms successful insertion.
      // REQUIREMENT 9: Display the actual Supabase error if insertion fails.
      if (!supabaseResult.success) {
        setSubmissionError(supabaseResult.error || 'Failed to insert registration into Supabase.');
        setSubmissionErrorCode(supabaseResult.errorCode || null);
        return;
      }

      // Supabase confirmed successful insertion!
      // Sync local context for instant LMS admin portal display
      submitRegistrationRequest({
        studentFullName: fullName.trim(),
        parentName: parentName.trim() || 'Not specified',
        studentMobile: studentMobile.trim(),
        parentMobile: parentMobile.trim() || studentMobile.trim(),
        email: email.trim().toLowerCase(),
        schoolName: schoolName.trim() || 'School in Sri Lanka',
        currentGrade,
        requestedGrade,
        academicYear: '2026',
        preferredClass,
        additionalMessage: additionalMessage.trim(),
        student_name: fullName.trim(),
        mobile: studentMobile.trim(),
        preferred_batch: preferredClass,
        additional_notes: additionalMessage.trim(),
      });

      setSavedSummary({
        studentName: fullName.trim(),
        requestedGrade,
        preferredBatch: preferredClass,
        mobile: studentMobile.trim(),
        savedToSupabase: true,
      });

      // Reset form fields after confirmed successful submission
      setFullName('');
      setParentName('');
      setStudentMobile('');
      setParentMobile('');
      setEmail('');
      setSchoolName('');
      setAdditionalMessage('');
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred during Supabase submission.');
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
    const sql = `-- Supabase Table & RLS Setup for public.registration_requests
CREATE TABLE IF NOT EXISTS public.registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    parent_name TEXT,
    mobile TEXT NOT NULL,
    parent_mobile TEXT,
    email TEXT NOT NULL,
    school_name TEXT,
    current_grade INT NOT NULL,
    requested_grade INT NOT NULL,
    preferred_batch TEXT NOT NULL,
    additional_notes TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe column additions if table already exists
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS parent_mobile TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS school_name TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS current_grade INT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS requested_grade INT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS preferred_batch TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS additional_notes TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Enable Row Level Security (RLS)
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to submit registration requests
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'registration_requests' 
        AND policyname = 'Allow public registration insert'
    ) THEN
        CREATE POLICY "Allow public registration insert" 
        ON public.registration_requests 
        FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);
    END IF;
END $$;`;

    navigator.clipboard.writeText(sql);
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 3000);
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
              <span>Confirmed Saved to Supabase Table: registration_requests</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4A]">
              Thank You, {savedSummary.studentName}!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto font-sinhala leading-relaxed">
              ඔබගේ Grade {savedSummary.requestedGrade} ICT පන්ති ලියාපදිංචි ඉල්ලීම සාර්ථකව Supabase දත්ත ගබඩාව වෙත ලැබිණි. අපගේ පරිපාලන කණ්ඩායම WhatsApp හෝ දුරකථන මාර්ගයෙන් කෙටි වේලාවකින් ඔබව සම්බන්ධ කරගනු ඇත.
            </p>
          </div>

          <div className="bg-[#EAF3FC] rounded-2xl p-4 text-xs text-[#0B1F4A] max-w-md mx-auto space-y-1.5 text-left border border-[#2563A6]/20">
            <div className="flex justify-between">
              <span className="text-slate-500">Requested Grade:</span>
              <span className="font-bold">Grade {savedSummary.requestedGrade} ICT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Preferred Batch:</span>
              <span className="font-bold">{savedSummary.preferredBatch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-mono font-bold">{savedSummary.mobile}</span>
            </div>
            <div className="flex justify-between border-t border-[#2563A6]/10 pt-1.5">
              <span className="text-slate-500">Supabase Record:</span>
              <span className="font-semibold text-emerald-700">
                ✓ Verified inserted into public.registration_requests
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/94772735518?text=${encodeURIComponent(`Hello Hemantha Sir, I submitted a registration request for Grade ${savedSummary.requestedGrade} ICT. Student: ${savedSummary.studentName}, Mobile: ${savedSummary.mobile}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <span>Verify on WhatsApp (077 273 5518)</span>
            </a>
            <button
              onClick={handleResetForm}
              className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit Another Registration</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#0B1F4A] hover:bg-[#163675] text-white text-xs font-bold rounded-xl"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0B1F4A] text-white p-8 sm:p-10 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F58220] text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Academic Year 2026 Admissions</span>
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
                title="View Supabase connection status & settings"
              >
                <Database className={`w-3 h-3 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>{isConfigured ? 'Supabase Connected' : 'Configure Supabase'}</span>
                <Settings className="w-3 h-3 opacity-70" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Grade 6–11 ICT Class Registration Request
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sinhala leading-relaxed">
              හේමන්ත වන්නිනායක (B.Sc) ICT ඇකඩමියේ නව පන්ති සඳහා අදම ආසනයක් වෙන්කරවා ගන්න.
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            
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
                    <span>Supabase Database Error {submissionErrorCode ? `(${submissionErrorCode})` : ''}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(true)}
                    className="text-[11px] underline text-red-700 hover:text-red-900 font-semibold"
                  >
                    Check Supabase Settings
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
                      Enter Supabase URL & Anon Key
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Student Name (student_name) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Malith Sandeepa Bandara"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 2. Parent Name (parent_name) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Parent / Guardian Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Sunil Bandara"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 3. Student Mobile (mobile) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Student Mobile / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    disabled={isSubmitting}
                    value={studentMobile}
                    onChange={(e) => setStudentMobile(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 4. Parent Mobile (parent_mobile) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Parent Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    disabled={isSubmitting}
                    value={parentMobile}
                    onChange={(e) => setParentMobile(e.target.value)}
                    placeholder="071 987 6543"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 5. Email Address (email) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 6. School Name (school_name) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  School Name
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Royal College Colombo / Maliyadeva"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* 7. Current Grade (current_grade) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Current Grade in School
                </label>
                <select
                  disabled={isSubmitting}
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value={6}>Grade 6</option>
                  <option value={7}>Grade 7</option>
                  <option value={8}>Grade 8</option>
                  <option value={9}>Grade 9</option>
                  <option value={10}>Grade 10</option>
                  <option value={11}>Grade 11</option>
                </select>
              </div>

              {/* 8. Requested Grade (requested_grade) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Requested Grade Class <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={isSubmitting}
                  value={requestedGrade}
                  onChange={(e) => setRequestedGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#F58220] bg-orange-50/30 text-[#0B1F4A] font-bold disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value={6}>Grade 6 ICT Classes</option>
                  <option value={7}>Grade 7 ICT Classes</option>
                  <option value={8}>Grade 8 ICT Classes</option>
                  <option value={9}>Grade 9 ICT Classes</option>
                  <option value={10}>Grade 10 ICT Classes</option>
                  <option value={11}>Grade 11 ICT Classes (O/L Revision)</option>
                </select>
              </div>

              {/* 9. Preferred Batch (preferred_batch) */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Preferred Class Time & Batch (preferred_batch)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    disabled={isSubmitting}
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="Sunday Morning Online Class (8:30 AM - 11:30 AM)">Sunday Morning Online Class (8:30 AM - 11:30 AM)</option>
                    <option value="Saturday Evening Online Class (4:00 PM - 7:00 PM)">Saturday Evening Online Class (4:00 PM - 7:00 PM)</option>
                    <option value="Wednesday Evening Paper Class (5:00 PM - 7:30 PM)">Wednesday Evening Paper Class (5:00 PM - 7:30 PM)</option>
                    <option value="Physical Hall Session (Weekend Batch)">Physical Hall Session (Weekend Batch)</option>
                  </select>
                </div>
              </div>

              {/* 10. Additional Notes (additional_notes) */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Additional Notes / Learning Goals (additional_notes)
                </label>
                <textarea
                  rows={3}
                  disabled={isSubmitting}
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="Tell us about your target examination score, any specific topics (e.g. Python, flowcharts), or queries..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] resize-none disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-slate-500">
                🔒 Direct insert into Supabase <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">public.registration_requests</code> with RLS.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F58220] hover:bg-[#e07519] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inserting into Supabase...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Registration Request</span>
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
