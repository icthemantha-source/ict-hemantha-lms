import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, isLoading } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else if (email.toLowerCase().includes('teacher')) {
        navigate('/teacher');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    const res = await login(roleEmail, 'Password123!');
    if (res.success) {
      if (roleEmail.includes('admin')) {
        navigate('/admin');
      } else if (roleEmail.includes('teacher')) {
        navigate('/teacher');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B1F4A] to-[#2563A6] flex items-center justify-center text-white mx-auto shadow-md">
              <GraduationCap className="w-7 h-7 text-[#F58220]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0B1F4A]">
              ICT Academy LMS Login
            </h1>
            <p className="text-xs text-slate-500 font-sinhala">
              {language === 'si' 
                ? 'ඔබගේ ශිෂ්‍ය හෝ පරිපාලක ගිණුමට ඇතුල් වන්න.' 
                : 'Sign in to access your courses, live classes & exams.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@icthemantha.lk"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] font-semibold text-[#2563A6] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#F58220] hover:bg-[#e07519] disabled:opacity-75 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Fast-Login */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-2.5">
              Instant One-Click Demo Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student@icthemantha.lk')}
                className="py-2 px-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-[#EAF3FC] text-[#0B1F4A] transition-colors text-center"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@icthemantha.lk')}
                className="py-2 px-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-orange-50 text-[#F58220] transition-colors text-center"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher@icthemantha.lk')}
                className="py-2 px-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:bg-emerald-50 text-emerald-700 transition-colors text-center"
              >
                Teacher Demo
              </button>
            </div>
          </div>

          {/* Sign Up Redirect */}
          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            New to ICT Hemantha Academy?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-[#2563A6] hover:underline"
            >
              Register here
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
