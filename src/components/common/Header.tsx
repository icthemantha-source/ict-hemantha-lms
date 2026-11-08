import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  FileText,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gradesDropdownOpen, setGradesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const grades = [6, 7, 8, 9, 10, 11] as const;

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setGradesDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top emergency announcement ticker / quick contact strip */}
      <div className="bg-[#0B1F4A] text-white text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-200">
              {language === 'si' ? '2026 O/L සහ කනිෂ්ඨ ICT නව පන්ති ඇරඹුම' : '2026 O/L & Junior ICT New Intake Now Open'}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">
              {language === 'si' ? 'හේමන්ත වන්නිනායක (B.Sc)' : 'Instructor: Hemantha Wanninayake B.Sc'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a 
              href="https://wa.me/94772735518" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-[#F58220] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F58220]" />
              <span>077 273 5518</span>
            </a>
            <span className="text-slate-500">|</span>
            <a 
              href="https://maps.app.goo.gl/QdtHZKfNFxx9B57LA?g_st=aw" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              {language === 'si' ? 'ස්ථානය' : 'Academy Location'}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left Side: Academy Logo & Name */}
          <div 
            onClick={() => handleNav('/')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B1F4A] to-[#2563A6] flex items-center justify-center text-white shadow-md shadow-[#0B1F4A]/15 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-[#F58220]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#0B1F4A] leading-tight group-hover:text-[#2563A6] transition-colors">
                Hemantha Wanninayake B.Sc
              </span>
              <span className="text-xs font-semibold text-[#F58220] tracking-wide uppercase">
                ICT Academy · Online LMS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#172033]">
            <button
              onClick={() => handleNav('/')}
              className={`hover:text-[#F58220] transition-colors ${currentPath === '/' ? 'text-[#F58220] font-semibold' : ''}`}
            >
              {t('nav.home')}
            </button>

            {/* Grades Dropdown */}
            <div className="relative">
              <button
                onClick={() => setGradesDropdownOpen(!gradesDropdownOpen)}
                className={`flex items-center gap-1 hover:text-[#F58220] transition-colors ${
                  currentPath.startsWith('/grade/') ? 'text-[#F58220] font-semibold' : ''
                }`}
              >
                <span>{language === 'si' ? 'ශ්‍රේණි (Grades 6–11)' : 'Grades (6–11)'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${gradesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {gradesDropdownOpen && (
                <div 
                  onMouseLeave={() => setGradesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'si' ? 'තෝරාගත් ශ්‍රේණිය' : 'Select ICT Course'}
                  </div>
                  {grades.map(grade => (
                    <button
                      key={grade}
                      onClick={() => handleNav(`/grade/${grade}`)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#EAF3FC] transition-colors flex items-center justify-between ${
                        currentPath === `/grade/${grade}` ? 'bg-[#EAF3FC] text-[#2563A6] font-semibold' : 'text-[#172033]'
                      }`}
                    >
                      <span>Grade {grade} ICT</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {grade === 11 ? 'O/L Exam' : grade === 10 ? 'O/L Core' : 'Junior'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/papers')}
              className={`flex items-center gap-1 hover:text-[#F58220] transition-colors ${
                currentPath === '/papers' ? 'text-[#F58220] font-semibold' : ''
              }`}
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>{t('nav.pastPapers')}</span>
            </button>

            <button
              onClick={() => handleNav('/registration-request')}
              className={`hover:text-[#F58220] transition-colors ${
                currentPath === '/registration-request' ? 'text-[#F58220] font-semibold' : ''
              }`}
            >
              <span>{t('nav.registerRequest')}</span>
            </button>
          </nav>

          {/* Right Actions: Language Switch & Login/User Menu */}
          <div className="flex items-center gap-3">
            
            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              title={language === 'en' ? 'Switch to Sinhala' : 'Switch to English'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#2563A6]" />
              <span>{language === 'en' ? 'සිංහල' : 'English'}</span>
            </button>

            {/* User Menu or Login CTA */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-[#0B1F4A] leading-tight truncate max-w-[120px]">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-[#F58220] uppercase font-semibold">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                      <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNav('/dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#EAF3FC] flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#2563A6]" />
                        <span>{t('dash.myCourses')}</span>
                      </button>

                      <button
                        onClick={() => handleNav('/dashboard/lessons')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#EAF3FC] flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4 text-[#2563A6]" />
                        <span>{t('dash.recordedLessons')}</span>
                      </button>

                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#EAF3FC] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#F58220]" />
                        <span>{t('nav.adminPortal')}</span>
                      </button>

                      <button
                        onClick={() => handleNav('/teacher')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#EAF3FC] flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>{t('nav.teacherPortal')}</span>
                      </button>
                    </div>

                    {/* Quick Demo Role Switchers for testing */}
                    <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
                      <span className="font-semibold block mb-1">Switch View Role:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { switchRole('student'); setUserDropdownOpen(false); }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${currentUser.role === 'student' ? 'bg-[#0B1F4A] text-white' : 'bg-white border'}`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => { switchRole('admin'); setUserDropdownOpen(false); }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${currentUser.role === 'admin' ? 'bg-[#F58220] text-white' : 'bg-white border'}`}
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => { switchRole('teacher'); setUserDropdownOpen(false); }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${currentUser.role === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                        >
                          Teacher
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#F58220] hover:bg-[#e07519] rounded-xl shadow-xs shadow-[#F58220]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('nav.login')}
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNav('/')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPath === '/' ? 'bg-[#EAF3FC] text-[#2563A6] font-semibold' : 'text-slate-700'
              }`}
            >
              {t('nav.home')}
            </button>

            <div className="px-3 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'si' ? 'ශ්‍රේණි පාඨමාලා' : 'Grade Courses'}
            </div>
            {grades.map(grade => (
              <button
                key={grade}
                onClick={() => handleNav(`/grade/${grade}`)}
                className={`text-left px-4 py-1.5 rounded-lg text-sm ${
                  currentPath === `/grade/${grade}` ? 'bg-[#EAF3FC] text-[#2563A6] font-semibold' : 'text-slate-600'
                }`}
              >
                Grade {grade} ICT
              </button>
            ))}

            <button
              onClick={() => handleNav('/papers')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPath === '/papers' ? 'bg-[#EAF3FC] text-[#2563A6]' : 'text-slate-700'
              }`}
            >
              {t('nav.pastPapers')}
            </button>

            <button
              onClick={() => handleNav('/registration-request')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPath === '/registration-request' ? 'bg-[#EAF3FC] text-[#2563A6]' : 'text-slate-700'
              }`}
            >
              {t('nav.registerRequest')}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full text-center py-2.5 bg-[#0B1F4A] text-white text-sm font-semibold rounded-xl"
                >
                  {t('nav.dashboard')}
                </button>
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full text-center py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl"
                >
                  {t('nav.adminPortal')}
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 text-red-600 text-sm font-medium"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="w-full text-center py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-xl shadow-xs"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
