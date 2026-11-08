import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  navigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#0B1F4A]">Reset LMS Password</h1>
          <p className="text-xs text-slate-500">
            Enter your student registered email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-xs text-slate-600">
              A password reset link has been dispatched to <span className="font-bold text-slate-900">{email}</span>. Please check your inbox or spam folder.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-[#0B1F4A] text-white text-xs font-bold rounded-xl"
            >
              Back to Login
            </button>
          </div>
        ) : (
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
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563A6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F58220] hover:bg-[#e07519] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Password Reset Email</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
