import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'si';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Navigation
    'nav.home': 'Home',
    'nav.grade6': 'Grade 6',
    'nav.grade7': 'Grade 7',
    'nav.grade8': 'Grade 8',
    'nav.grade9': 'Grade 9',
    'nav.grade10': 'Grade 10',
    'nav.grade11': 'Grade 11',
    'nav.courses': 'Courses',
    'nav.pastPapers': 'Past Papers',
    'nav.registerRequest': 'Register Now',
    'nav.login': 'Student Login',
    'nav.dashboard': 'Dashboard',
    'nav.adminPortal': 'Admin Portal',
    'nav.teacherPortal': 'Teacher Portal',
    'nav.logout': 'Sign Out',

    // Hero
    'hero.badge': 'G.C.E. O/L & Junior ICT Excellence',
    'hero.sinhalaTitle': 'ICT පන්ති - 6 සිට 11 ශ්‍රේණි දක්වා',
    'hero.englishTitle': 'Hemantha Wanninayake B.Sc ICT LMS',
    'hero.description': 'Interactive lessons, quizzes, past papers & video tutorials for O/L ICT. Learn anytime, anywhere — at your own pace.',
    'hero.sinhalaDesc': '6 සිට 11 ශ්‍රේණිය දක්වා ICT ඉගෙනුම් කටයුතු සඳහා Online Learning Platform එක.',
    'hero.startLearning': 'Start Learning',
    'hero.startLearningSi': 'කරමින් ඉගෙනීම ආරම්භ කරන්න',
    'hero.viewCurriculum': 'View Curriculum',
    'hero.viewCurriculumSi': 'පාඨමාලා බලන්න',
    'hero.badgeLive': 'Live Zoom Classes',
    'hero.badgeQuizzes': 'Quizzes & Past Papers',
    'hero.badgeCert': 'Official ICT Certificate',

    // Grade Course Section
    'grades.title': 'Choose Your Grade · ශ්‍රේණිය තෝරන්න',
    'grades.subtitle': 'Select your grade to access lessons, exercises, and learning resources designed for each grade.',
    'grades.viewDetails': 'View Course & Syllabus',
    'grades.lessons': 'Lessons',
    'grades.hours': 'Hours',
    'grades.monthlyFee': 'Monthly Fee',
    'grades.enrolled': 'Enrolled Students',

    // Instructor
    'instructor.title': 'Meet Your Instructor',
    'instructor.subtitle': 'Learn with a qualified ICT educator with 14+ years of teaching excellence',
    'instructor.qualifications': 'Key Qualifications',
    'instructor.experience': '14+ Years Teaching Experience',
    'instructor.contactTeacher': 'Inquire on WhatsApp',

    // Registration quick CTA
    'reg.badge': 'Admissions Open 2026',
    'reg.title': 'Request Class Enrollment Today',
    'reg.desc': 'Join thousands of Sri Lankan students securing "A" passes in ICT.',
    'reg.button': 'Submit Registration Request',

    // Student Dashboard
    'dash.welcome': 'Welcome back',
    'dash.myCourses': 'My Courses',
    'dash.recordedLessons': 'Recorded Lessons',
    'dash.liveClasses': 'Live Classes',
    'dash.exams': 'Online Exams',
    'dash.results': 'My Results',
    'dash.attendance': 'Attendance Record',
    'dash.progress': 'Progress Report',
    'dash.payments': 'Course Payments',
    'dash.profile': 'My Profile',
    'dash.announcements': 'Grade Announcements',
    'dash.recentLessons': 'Recent Lessons',
    'dash.upcomingExams': 'Upcoming Exams',

    // Common
    'common.search': 'Search...',
    'common.filter': 'Filter by Grade',
    'common.all': 'All',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.downloadPdf': 'Download PDF',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.action': 'Actions',
  },
  si: {
    // Top Bar & Navigation
    'nav.home': 'මුල් පිටුව',
    'nav.grade6': '6 ශ්‍රේණිය',
    'nav.grade7': '7 ශ්‍රේණිය',
    'nav.grade8': '8 ශ්‍රේණිය',
    'nav.grade9': '9 ශ්‍රේණිය',
    'nav.grade10': '10 ශ්‍රේණිය',
    'nav.grade11': '11 ශ්‍රේණිය',
    'nav.courses': 'පාඨමාලා',
    'nav.pastPapers': 'ප්‍රශ්න පත්‍ර',
    'nav.registerRequest': 'ලියාපදිංචි වන්න',
    'nav.login': 'ඇතුල් වන්න',
    'nav.dashboard': 'ශිෂ්‍ය පුවරුව',
    'nav.adminPortal': 'පරිපාලක පුවරුව',
    'nav.teacherPortal': 'ගුරු පුවරුව',
    'nav.logout': 'ඉවත් වන්න',

    // Hero
    'hero.badge': 'අ.පො.ස සාමාන්‍ය පෙළ සහ කනිෂ්ඨ ICT විශිෂ්ටත්වය',
    'hero.sinhalaTitle': 'ICT පන්ති - 6 සිට 11 ශ්‍රේණි දක්වා',
    'hero.englishTitle': 'Hemantha Wanninayake B.Sc ICT LMS',
    'hero.description': 'O/L ICT සඳහා අන්තර්ක්‍රියාකාරී පාඩම්, ප්‍රශ්නාවලි, පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ වීඩියෝ නිබන්ධන.',
    'hero.sinhalaDesc': '6 සිට 11 ශ්‍රේණිය දක්වා ICT ඉගෙනුම් කටයුතු සඳහා Online Learning Platform එක.',
    'hero.startLearning': 'කරමින් ඉගෙනීම ආරම්භ කරන්න',
    'hero.startLearningSi': 'කරමින් ඉගෙනීම ආරම්භ කරන්න',
    'hero.viewCurriculum': 'පාඨමාලා බලන්න',
    'hero.viewCurriculumSi': 'පාඨමාලා බලන්න',
    'hero.badgeLive': 'සජීවී Zoom පන්ති',
    'hero.badgeQuizzes': 'ප්‍රශ්නාවලි සහ පසුගිය ප්‍රශ්න පත්‍ර',
    'hero.badgeCert': 'නිල ICT සහතිකය',

    // Grade Course Section
    'grades.title': 'Choose Your Grade · ශ්‍රේණිය තෝරන්න',
    'grades.subtitle': 'ඔබගේ ශ්‍රේණිය තෝරා පාඩම්, අභ්‍යාස සහ ඉගෙනුම් සම්පත් ලබාගන්න.',
    'grades.viewDetails': 'පාඨමාලා විස්තර බලන්න',
    'grades.lessons': 'පාඩම්',
    'grades.hours': 'පැය',
    'grades.monthlyFee': 'මාසික ගාස්තුව',
    'grades.enrolled': 'ලියාපදිංචි සිසුන්',

    // Instructor
    'instructor.title': 'ඔබගේ ගුරුවරයා',
    'instructor.subtitle': 'වසර 14කට වැඩි පළපුරුද්දක් ඇති ගෞරවනීය ICT දේශක හේමන්ත වන්නිනායක මහතා',
    'instructor.qualifications': 'ප්‍රධාන සුදුසුකම්',
    'instructor.experience': 'වසර 14+ ඉගැන්වීමේ අත්දැකීම්',
    'instructor.contactTeacher': 'WhatsApp මගින් විමසන්න',

    // Registration quick CTA
    'reg.badge': '2026 නව පන්ති ලියාපදිංචිය',
    'reg.title': 'අදම පන්ති සඳහා ඉල්ලුම් කරන්න',
    'reg.desc': 'ICT විශිෂ්ට A සාමාර්ථයක් සහතික කරගැනීමට අප හා එක්වන්න.',
    'reg.button': 'ලියාපදිංචි ඉල්ලීම යොමු කරන්න',

    // Student Dashboard
    'dash.welcome': 'ආයුබෝවන්',
    'dash.myCourses': 'මගේ පාඨමාලා',
    'dash.recordedLessons': 'පටිගත කළ පාඩම්',
    'dash.liveClasses': 'සජීවී පන්ති',
    'dash.exams': 'මාර්ගගත විභාග',
    'dash.results': 'මගේ ප්‍රතිඵල',
    'dash.attendance': 'පැමිණීමේ වාර්තාව',
    'dash.progress': 'ප්‍රගති වාර්තාව',
    'dash.payments': 'පාඨමාලා ගෙවීම්',
    'dash.profile': 'මගේ තොරතුරු',
    'dash.announcements': 'ශ්‍රේණි නිවේදන',
    'dash.recentLessons': 'මෑත පාඩම්',
    'dash.upcomingExams': 'ඉදිරි විභාග',

    // Common
    'common.search': 'සොයන්න...',
    'common.filter': 'ශ්‍රේණිය අනුව පෙරන්න',
    'common.all': 'සියල්ල',
    'common.save': 'වෙනස්කම් සුරකින්න',
    'common.cancel': 'අවලංගු කරන්න',
    'common.submit': 'යොමු කරන්න',
    'common.downloadPdf': 'PDF බාගත කරන්න',
    'common.status': 'තත්ත්වය',
    'common.date': 'දිනය',
    'common.action': 'ක්‍රියාමාර්ග',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ict_hemantha_lang');
    return (saved === 'si' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ict_hemantha_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'si' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
