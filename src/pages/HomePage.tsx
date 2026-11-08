import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  Video, 
  Award, 
  FileCheck, 
  ArrowRight, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  School
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { language, t } = useLanguage();
  const { courses, liveClasses, announcements, achievements, instructorProfile } = useData();

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION (Split-Layout as per Section 5) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#EAF3FC]/50 to-[#F5F7FA] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3FC] border border-[#2563A6]/20 text-[#2563A6] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Headings */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F4A] tracking-tight leading-[1.15]">
                  <span className="block font-sinhala text-[#F58220] pb-1">
                    {t('hero.sinhalaTitle')}
                  </span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl text-[#0B1F4A] font-bold">
                    {t('hero.englishTitle')}
                  </span>
                </h1>
              </div>

              {/* Descriptions (English & Sinhala) */}
              <div className="space-y-2.5 max-w-2xl">
                <p className="text-base sm:text-lg text-[#172033] font-medium leading-relaxed">
                  {t('hero.description')}
                </p>
                <p className="text-sm sm:text-base text-slate-600 font-sinhala leading-relaxed">
                  {t('hero.sinhalaDesc')}
                </p>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/registration-request')}
                  className="px-6 py-3.5 rounded-xl bg-[#F58220] hover:bg-[#e07519] text-white font-bold text-sm shadow-md shadow-[#F58220]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>{language === 'si' ? t('hero.startLearningSi') : t('hero.startLearning')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('grade-courses-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#0B1F4A] font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#2563A6]" />
                  <span>{language === 'si' ? t('hero.viewCurriculumSi') : t('hero.viewCurriculum')}</span>
                </button>
              </div>

              {/* 3 Hero Feature Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-[#2563A6]/10 text-[#2563A6] flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <span>{t('hero.badgeLive')}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-[#F58220]/10 text-[#F58220] flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span>{t('hero.badgeQuizzes')}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <span>{t('hero.badgeCert')}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Premium Sri Lankan Student Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2563A6]/20 to-[#F58220]/20 rounded-3xl blur-xl" />
                
                {/* Main Image Frame */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-white aspect-[4/3] sm:aspect-[16/10]">
                  <img
                    src="/src/assets/images/hero_sri_lankan_student_1794084338373.jpg"
                    alt="Sri Lankan school student learning ICT on laptop"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4A]/80 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                        Interactive Online & Physical Sessions
                      </div>
                      <p className="text-sm font-semibold leading-tight">
                        Empowering Sri Lanka’s next generation of software engineers and ICT leaders.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Trust Card */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1F4A] text-white flex items-center justify-center">
                    <School className="w-5 h-5 text-[#F58220]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B1F4A]">8,500+ Students Mentored</div>
                    <div className="text-[11px] text-slate-500">Grades 6–11 All Over Sri Lanka</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR GRADE SECTION (Section 6) */}
      <section id="grade-courses-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold text-[#2563A6] uppercase tracking-wider">
            Curriculum Structure · විෂය නිර්දේශය
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4A]">
            {t('grades.title')}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-sinhala">
            {t('grades.subtitle')}
          </p>
        </div>

        {/* 6 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/grade/${course.grade}`)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#2563A6]/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Course Header Banner */}
                <div className="h-32 bg-gradient-to-br from-[#0B1F4A] to-[#2563A6] p-5 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#F58220] text-white">
                      Grade {course.grade}
                    </span>
                    <span className="text-xs font-medium text-slate-200">
                      {course.durationHours} Hours
                    </span>
                  </div>
                  <div className="z-10">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-[#F58220] transition-colors">
                      {course.title.replace(/^Grade \d+:\s*/, '')}
                    </h3>
                  </div>
                  {/* Decorative faint background element */}
                  <div className="absolute -right-4 -bottom-4 text-white/5 font-extrabold text-7xl select-none">
                    G{course.grade}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="text-xs text-[#0B1F4A] font-sinhala line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {course.descriptionSi}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {course.learningOutcomes.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-4 bg-[#F5F7FA] border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('grades.monthlyFee')}</span>
                  <span className="font-bold text-[#0B1F4A] text-sm">
                    LKR {course.monthlyFeeLkr.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-[#2563A6] group-hover:text-[#F58220] transition-colors">
                  <span>{t('grades.viewDetails')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 3. INSTRUCTOR PROFILE SECTION (Section 28 F) */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Instructor Photo */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                  <img
                    src={instructorProfile.photoUrl}
                    alt={instructorProfile.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 right-2 bg-[#0B1F4A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md border border-[#F58220]">
                  14+ Years Experience
                </div>
              </div>
            </div>

            {/* Biography & Qualifications */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#F58220] uppercase tracking-wider">
                  Lead Instructor & Academic Director
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4A]">
                  {instructorProfile.name}
                </h2>
                <p className="text-sm font-semibold text-[#2563A6]">
                  {instructorProfile.degrees} · {instructorProfile.title}
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {instructorProfile.bioEn}
              </p>

              <p className="text-xs text-slate-600 font-sinhala leading-relaxed bg-[#EAF3FC]/50 p-3 rounded-xl border border-[#2563A6]/10">
                {instructorProfile.bioSi}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Academic Specializations & Qualifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {instructorProfile.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2563A6] shrink-0" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/94772735518"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('instructor.contactTeacher')}</span>
                </a>
                <a
                  href={instructorProfile.locationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <span>Academy Location</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. LIVE SESSIONS & GRADE ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upcoming Live Classes (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0B1F4A]">Upcoming Live Classes</h3>
                <p className="text-xs text-slate-500">Live Zoom & interactive workshops</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard/lessons')}
                className="text-xs font-semibold text-[#2563A6] hover:text-[#F58220]"
              >
                View all in LMS →
              </button>
            </div>

            <div className="space-y-3">
              {liveClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#0B1F4A] text-white">
                        Grade {cls.grade}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" />
                        {cls.platform}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {cls.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(cls.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(cls.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-[#F58220] hover:bg-[#e07519] text-white font-bold text-xs rounded-xl text-center shadow-xs whitespace-nowrap"
                  >
                    Join Class
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Strip (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0B1F4A]">Academy Bulletins</h3>
                <p className="text-xs text-slate-500">Grade notices and exam dates</p>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className={`bg-white rounded-xl border p-4 shadow-2xs space-y-2 ${
                    ann.isImportant ? 'border-[#F58220]/40 bg-orange-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      ann.targetGrade === 'all' 
                        ? 'bg-slate-100 text-slate-700' 
                        : 'bg-[#EAF3FC] text-[#2563A6]'
                    }`}>
                      {ann.targetGrade === 'all' ? 'All Grades' : `Grade ${ann.targetGrade}`}
                    </span>
                    <span className="text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    {ann.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. RESULTS & TESTIMONIALS GALLERY (Section 28 E) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-bold text-[#F58220] uppercase tracking-wider">
            Proven Examination Excellence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4A]">
            Student Achievements & Stories
          </h2>
          <p className="text-xs text-slate-500">
            Real feedback from students and parents across G.C.E. O/L ICT examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ach.photoUrl}
                    alt={ach.studentName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#2563A6]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{ach.studentName}</h4>
                    <span className="text-xs text-slate-500">{ach.academicYear} · Grade {ach.grade}</span>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded font-extrabold text-xs bg-emerald-100 text-emerald-800">
                    Grade {ach.resultGrade}
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  {ach.testimonialText}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#2563A6]">
                {ach.achievementText}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GRADE REGISTRATION PUBLIC CTA BANNER (Section 28 D) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1F4A] via-[#163675] to-[#2563A6] text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 text-center lg:text-left z-10">
            <span className="px-3 py-1 rounded-full bg-[#F58220] text-white text-xs font-bold uppercase tracking-wider inline-block">
              {t('reg.badge')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {t('reg.title')}
            </h3>
            <p className="text-sm text-slate-200 max-w-xl font-sinhala">
              {t('reg.desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
            <button
              onClick={() => navigate('/registration-request')}
              className="px-6 py-3.5 bg-[#F58220] hover:bg-[#e07519] text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {t('reg.button')}
            </button>
            <a
              href="https://wa.me/94772735518"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl text-center"
            >
              Inquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
