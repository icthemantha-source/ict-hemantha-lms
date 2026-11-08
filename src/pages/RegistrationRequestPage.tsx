import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { GradeLevel } from '../types';
import { 
  CheckCircle, 
  Send, 
  School, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RegistrationRequestPageProps {
  navigate: (path: string) => void;
}

export const RegistrationRequestPage: React.FC<RegistrationRequestPageProps> = ({ navigate }) => {
  const { submitRegistrationRequest } = useData();
  const { language } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(10);
  const [requestedGrade, setRequestedGrade] = useState<GradeLevel>(11);
  const [academicYear, setAcademicYear] = useState('2026');
  const [preferredClass, setPreferredClass] = useState('Sunday Morning Online Class (8:30 AM - 11:30 AM)');
  const [additionalMessage, setAdditionalMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (!fullName || !studentMobile || !email) {
      setValidationError('Please fill in the required student name, mobile, and email.');
      return;
    }

    submitRegistrationRequest({
      studentFullName: fullName,
      parentName: parentName || 'Not specified',
      studentMobile,
      parentMobile: parentMobile || studentMobile,
      email,
      schoolName: schoolName || 'School in Sri Lanka',
      currentGrade,
      requestedGrade,
      academicYear,
      preferredClass,
      additionalMessage
    });

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {isSubmitted ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xl space-y-5 animate-in fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">
              Application Successfully Submitted
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4A]">
              Thank You, {fullName}!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto font-sinhala leading-relaxed">
              ඔබගේ Grade {requestedGrade} ICT පන්ති ලියාපදිංචි ඉල්ලීම සාර්ථකව අප වෙත ලැබිණි. අපගේ පරිපාලන කණ්ඩායම WhatsApp හෝ දුරකථන මාර්ගයෙන් කෙටි වේලාවකින් ඔබව සම්බන්ධ කරගනු ඇත.
            </p>
          </div>

          <div className="bg-[#EAF3FC] rounded-2xl p-4 text-xs text-[#0B1F4A] max-w-md mx-auto space-y-1.5 text-left border border-[#2563A6]/20">
            <div className="flex justify-between">
              <span className="text-slate-500">Requested Grade:</span>
              <span className="font-bold">Grade {requestedGrade} ICT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Preferred Batch:</span>
              <span className="font-bold">{preferredClass}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-mono font-bold">{studentMobile}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/94772735518?text=${encodeURIComponent(`Hello Hemantha Sir, I submitted a registration request for Grade ${requestedGrade} ICT. Student: ${fullName}, Mobile: ${studentMobile}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <span>Verify Instantly on WhatsApp</span>
            </a>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0B1F4A] text-white p-8 sm:p-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F58220] text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Year 2026 Admissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Grade 6–11 ICT Class Registration Request
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sinhala leading-relaxed">
              හේමන්ත වන්නිනායක (B.Sc) ICT ඇකඩමියේ නව පන්ති සඳහා අදම ආසනයක් වෙන්කරවා ගන්න.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                ⚠️ {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Student Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Malith Sandeepa Bandara"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              {/* Parent Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Parent / Guardian Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Sunil Bandara"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              {/* Student Mobile */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Student Mobile / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={studentMobile}
                    onChange={(e) => setStudentMobile(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              {/* Parent Mobile */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Parent Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={parentMobile}
                    onChange={(e) => setParentMobile(e.target.value)}
                    placeholder="071 987 6543"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              {/* School Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  School Name
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Royal College Colombo / Maliyadeva"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              {/* Current Grade */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Current Grade in School
                </label>
                <select
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value={6}>Grade 6</option>
                  <option value={7}>Grade 7</option>
                  <option value={8}>Grade 8</option>
                  <option value={9}>Grade 9</option>
                  <option value={10}>Grade 10</option>
                  <option value={11}>Grade 11</option>
                </select>
              </div>

              {/* Requested Grade for Academy */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Requested Grade Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={requestedGrade}
                  onChange={(e) => setRequestedGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#F58220] bg-orange-50/30 text-[#0B1F4A] font-bold"
                >
                  <option value={6}>Grade 6 ICT Classes</option>
                  <option value={7}>Grade 7 ICT Classes</option>
                  <option value={8}>Grade 8 ICT Classes</option>
                  <option value={9}>Grade 9 ICT Classes</option>
                  <option value={10}>Grade 10 ICT Classes</option>
                  <option value={11}>Grade 11 ICT Classes (O/L Revision)</option>
                </select>
              </div>

              {/* Preferred Class */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Preferred Class Time & Batch
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Sunday Morning Online Class (8:30 AM - 11:30 AM)">Sunday Morning Online Class (8:30 AM - 11:30 AM)</option>
                    <option value="Saturday Evening Online Class (4:00 PM - 7:00 PM)">Saturday Evening Online Class (4:00 PM - 7:00 PM)</option>
                    <option value="Wednesday Evening Paper Class (5:00 PM - 7:30 PM)">Wednesday Evening Paper Class (5:00 PM - 7:30 PM)</option>
                    <option value="Physical Hall Session (Weekend Batch)">Physical Hall Session (Weekend Batch)</option>
                  </select>
                </div>
              </div>

              {/* Additional Message */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Additional Notes / Learning Goals
                </label>
                <textarea
                  rows={3}
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="Tell us about your target examination score, any specific topics (e.g. Python, flowcharts), or queries..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6] resize-none"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-slate-500">
                🔒 Your personal contact data is strictly confidential and protected by academy security.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Registration Request</span>
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
