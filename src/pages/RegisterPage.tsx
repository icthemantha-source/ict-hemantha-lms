import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { GradeLevel } from '../types';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  School, 
  IdCard, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register, isLoading } = useAuth();
  const { language } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('STU-2026-' + Math.floor(1000 + Math.random() * 9000));
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(11);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all mandatory registration fields.');
      return;
    }

    const res = await register({
      fullName,
      email,
      phone,
      studentId,
      schoolName,
      grade,
      password
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1F4A] flex items-center justify-center text-white mx-auto shadow-md">
              <GraduationCap className="w-7 h-7 text-[#F58220]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1F4A]">
              Create Student LMS Account
            </h1>
            <p className="text-xs text-slate-500 font-sinhala">
              {language === 'si' 
                ? '6 සිට 11 ශ්‍රේණි සඳහා නව ශිෂ්‍ය ගිණුමක් සාදන්න.' 
                : 'Join the academy to track lessons, participate in exams, and download notes.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kasun Mihiranga"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">School Name</label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Ananda College"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Grade *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#2563A6] bg-white font-bold text-[#0B1F4A]"
                >
                  <option value={6}>Grade 6 ICT</option>
                  <option value={7}>Grade 7 ICT</option>
                  <option value={8}>Grade 8 ICT</option>
                  <option value={9}>Grade 9 ICT</option>
                  <option value={10}>Grade 10 ICT</option>
                  <option value={11}>Grade 11 ICT (O/L Candidate)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student ID (Issued)</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Account Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-[#F58220] hover:bg-[#e07519] disabled:opacity-75 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-[#2563A6] hover:underline"
            >
              Sign in here
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
