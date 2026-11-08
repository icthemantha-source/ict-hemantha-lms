import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  GraduationCap, 
  Phone, 
  MapPin, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#0B1F4A] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1 & 2: Academy Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563A6] to-[#0B1F4A] border border-white/20 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-7 h-7 text-[#F58220]" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Hemantha Wanninayake B.Sc
                </h3>
                <p className="text-xs font-semibold text-[#F58220] uppercase tracking-wider">
                  ICT Academy · LMS Platform
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {language === 'si'
                ? '6 සිට 11 ශ්‍රේණිය දක්වා ICT ඉගෙනුම් කටයුතු සඳහා විශිෂ්ටතම Online Learning Platform එක. අ.පො.ස සාමාන්‍ය පෙළ විභාගයේ A සාමාර්ථයක් සඳහා මගපෙන්වීම.'
                : 'Premier online ICT learning platform for Grades 6 through 11 in Sri Lanka. Proven track record of producing top national O/L ICT distinctions.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F58220]" />
                <span>14+ Years Teaching Excellence</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>92%+ "A" Pass Rate</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'si' ? 'ප්‍රධාන පිටු' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button 
                  onClick={() => navigate('/')} 
                  className="hover:text-[#F58220] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-[#F58220]" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/papers')} 
                  className="hover:text-[#F58220] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-[#F58220]" />
                  <span>Past Papers & Model Papers</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/registration-request')} 
                  className="hover:text-[#F58220] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-[#F58220]" />
                  <span>Grade Registration 2026</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/login')} 
                  className="hover:text-[#F58220] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-[#F58220]" />
                  <span>Student LMS Portal</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin')} 
                  className="hover:text-[#F58220] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-[#F58220]" />
                  <span>Admin Management</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Grade Courses */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'si' ? 'ශ්‍රේණි පාඨමාලා' : 'Grade Courses'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {[6, 7, 8, 9, 10, 11].map(grade => (
                <li key={grade}>
                  <button 
                    onClick={() => navigate(`/grade/${grade}`)} 
                    className="hover:text-[#F58220] transition-colors"
                  >
                    Grade {grade} ICT {grade === 11 ? '(O/L Revision)' : ''}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Official Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'si' ? 'සම්බන්ධීකරණය' : 'Academy Contact'}
            </h4>

            <a
              href="https://wa.me/94772735518"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-[#F58220] transition-colors group"
            >
              <Phone className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-white group-hover:text-[#F58220]">
                  077 273 5518
                </span>
                <span className="text-xs text-slate-400">Direct & WhatsApp</span>
              </div>
            </a>

            <div className="flex items-start gap-2.5 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
              <div>
                <span className="text-white block">icthemantha@gmail.com</span>
                <span className="text-xs text-slate-400">Academic Inquiries</span>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/QdtHZKfNFxx9B57LA?g_st=aw"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group pt-1"
            >
              <MapPin className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
              <div>
                <span className="text-white group-hover:underline block">
                  View Google Maps Location
                </span>
                <span className="text-xs text-slate-400">Physical & Online Centers</span>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Hemantha Wanninayake B.Sc - ICT Academy. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="hover:text-slate-200 transition-colors">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => navigate('/')} className="hover:text-slate-200 transition-colors">Terms & Conditions</button>
            <span>·</span>
            <a href="https://maps.app.goo.gl/QdtHZKfNFxx9B57LA?g_st=aw" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">Location</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
