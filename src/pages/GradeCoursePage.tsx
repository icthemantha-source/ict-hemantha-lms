import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PayHereModal } from '../components/common/PayHereModal';
import { 
  PlayCircle, 
  Lock, 
  FileText, 
  CheckCircle, 
  Download, 
  Clock, 
  BookOpen, 
  CreditCard,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface GradeCoursePageProps {
  grade: GradeLevel;
  navigate: (path: string) => void;
}

export const GradeCoursePage: React.FC<GradeCoursePageProps> = ({ grade, navigate }) => {
  const { courses, chapters, lessons, lessonProgress, enrollments, markLessonComplete, instructorProfile } = useData();
  const { currentUser } = useAuth();
  const { language } = useLanguage();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'resources'>('video');

  const course = courses.find(c => c.grade === grade);
  const courseLessons = lessons.filter(l => l.grade === grade).sort((a, b) => a.orderIndex - b.orderIndex);
  const courseChapters = chapters.filter(ch => ch.courseId === course?.id);

  // Check enrollment
  const isEnrolled = currentUser ? (
    currentUser.role === 'admin' ||
    currentUser.role === 'teacher' ||
    enrollments.some(e => e.studentId === currentUser.id && e.grade === grade && e.status === 'active')
  ) : false;

  // Selected lesson (default to first)
  const currentLesson = courseLessons.find(l => l.id === activeLessonId) || courseLessons[0];
  const isCurrentLessonLocked = !isEnrolled && !currentLesson?.isFreePreview;
  const isCurrentLessonCompleted = currentLesson && currentUser 
    ? lessonProgress.some(p => p.studentId === currentUser.id && p.lessonId === currentLesson.id && p.completed)
    : false;

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Grade {grade} ICT Course Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#F58220] text-white rounded-xl">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      
      {/* 1. Header Banner */}
      <div className="bg-[#0B1F4A] text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>/</span>
            <span className="text-[#F58220]">Grade {grade} ICT</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="px-3 py-1 rounded-full bg-[#F58220] text-white text-xs font-bold uppercase tracking-wider inline-block">
                {course.badge || `Grade ${grade} ICT`}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {course.title}
              </h1>
              <p className="text-sm font-sinhala text-slate-200">
                {course.titleSi}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {course.description}
              </p>
            </div>

            {/* Enrollment / Status Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-white min-w-[280px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Monthly Enrollment:</span>
                <span className="text-xl font-bold text-[#F58220]">
                  LKR {course.monthlyFeeLkr.toLocaleString()}
                </span>
              </div>

              {isEnrolled ? (
                <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-2.5 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Enrolled & All Access Unlocked</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold shadow-lg transition-transform hover:scale-[1.01]"
                >
                  Enroll & Unlock All Lessons
                </button>
              )}

              <div className="text-[11px] text-slate-300 flex items-center justify-between border-t border-white/10 pt-2">
                <span>{course.lessonCount} Recorded Lessons</span>
                <span>·</span>
                <span>Zoom Live Classes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Video Player & Lesson Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Interactive Player Frame */}
            <div className="rounded-2xl bg-black overflow-hidden shadow-xl border border-slate-200 aspect-video relative flex items-center justify-center">
              {isCurrentLessonLocked ? (
                /* Locked Scrim */
                <div className="absolute inset-0 bg-slate-900/90 text-white p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 text-[#F58220] flex items-center justify-center">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold">This Lesson is Protected</h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    Enroll in Grade {grade} ICT or verify your monthly payment to access this lecture, downloadable notes, and quiz.
                  </p>
                  <button
                    onClick={() => setIsPayModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold shadow-md flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Enroll Now (LKR {course.monthlyFeeLkr.toLocaleString()})</span>
                  </button>
                </div>
              ) : currentLesson ? (
                /* Video Player */
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-slate-400 text-sm">No lesson selected</div>
              )}
            </div>

            {/* Lesson Control & Completion Strip */}
            {currentLesson && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2563A6]">
                      Lesson {currentLesson.orderIndex} of {courseLessons.length}
                    </span>
                    {currentLesson.isFreePreview && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Free Preview
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#0B1F4A]">
                    {currentLesson.title}
                  </h2>
                  {currentLesson.titleSi && (
                    <p className="text-xs font-sinhala text-slate-600">
                      {currentLesson.titleSi}
                    </p>
                  )}
                </div>

                {currentUser && isEnrolled && (
                  <button
                    onClick={() => markLessonComplete(currentUser.id, currentLesson.id, !isCurrentLessonCompleted)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isCurrentLessonCompleted
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-[#0B1F4A] text-white hover:bg-[#163675]'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark as Complete'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Tabs: Video Notes, Downloadable PDFs, Related Quiz */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-5 py-3 border-b-2 flex items-center gap-2 ${
                    activeTab === 'video'
                      ? 'border-[#2563A6] text-[#2563A6] bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lesson Notes</span>
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-5 py-3 border-b-2 flex items-center gap-2 ${
                    activeTab === 'resources'
                      ? 'border-[#2563A6] text-[#2563A6] bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Handouts ({currentLesson?.resources.length || 0})</span>
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'video' && (
                  <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                    <p className="text-sm font-medium text-slate-800">
                      {currentLesson?.description}
                    </p>

                    {currentLesson?.notesMarkdown ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 whitespace-pre-line font-mono text-[11px] text-slate-800">
                        {currentLesson.notesMarkdown}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">
                        Supplementary study notes will be posted following the live lesson session.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    {currentLesson?.resources.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                            PDF
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{res.title}</h4>
                            <span className="text-[11px] text-slate-400">{res.fileSizeMb} MB · Verified Handout</span>
                          </div>
                        </div>

                        <a
                          href={res.fileUrl}
                          download
                          className="px-3 py-1.5 rounded-lg bg-[#2563A6] hover:bg-[#1d4f85] text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Course Curriculum & Lessons Drawer (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Instructor Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <img
                src={instructorProfile.photoUrl}
                alt={instructorProfile.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#F58220]">Course Lecturer</span>
                <h4 className="font-bold text-sm text-[#0B1F4A]">{instructorProfile.name}</h4>
                <p className="text-[11px] text-slate-500">{instructorProfile.degrees}</p>
              </div>
            </div>

            {/* Chapters & Lessons Accordion */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0B1F4A]">Course Syllabus</h3>
                  <p className="text-[11px] text-slate-500">{courseLessons.length} Total Lessons</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {courseLessons.map((les) => {
                  const isCurrent = currentLesson?.id === les.id;
                  const isDone = currentUser && lessonProgress.some(p => p.studentId === currentUser.id && p.lessonId === les.id && p.completed);

                  return (
                    <button
                      key={les.id}
                      onClick={() => setActiveLessonId(les.id)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isCurrent ? 'bg-[#EAF3FC]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : !isEnrolled && !les.isFreePreview ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : (
                          <PlayCircle className={`w-4 h-4 ${isCurrent ? 'text-[#2563A6]' : 'text-slate-400'}`} />
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-500">Lesson {les.orderIndex}</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {les.durationMinutes}m
                          </span>
                        </div>
                        <h4 className={`text-xs font-semibold leading-snug ${isCurrent ? 'text-[#2563A6] font-bold' : 'text-slate-800'}`}>
                          {les.title}
                        </h4>
                        {les.isFreePreview && (
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Free Preview
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links to Online Exams & Past Papers for this grade */}
            <div className="bg-[#EAF3FC] border border-[#2563A6]/20 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B1F4A]">
                Assessments & Past Papers
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practice with real exam questions and grade-specific revision papers.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate('/dashboard/exams')}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1F4A] hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#F58220]" />
                    Online MCQ Exams
                  </span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/papers')}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1F4A] hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2563A6]" />
                    Grade {grade} Question Papers
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* PayHere Modal */}
      <PayHereModal
        course={course}
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
      />

    </div>
  );
};
