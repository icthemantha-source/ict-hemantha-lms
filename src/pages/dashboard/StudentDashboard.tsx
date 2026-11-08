import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { PayHereModal } from '../../components/common/PayHereModal';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileCheck, 
  Award, 
  Calendar, 
  CreditCard, 
  User, 
  LogOut, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  ChevronRight,
  ExternalLink,
  Printer,
  Sparkles,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentDashboardProps {
  initialTab?: string;
  navigate: (path: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ initialTab = 'overview', navigate }) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { 
    courses, 
    lessons, 
    lessonProgress, 
    liveClasses, 
    enrollments, 
    exams, 
    examQuestions, 
    examAttempts, 
    submitExamAttempt,
    attendanceRecords, 
    payments, 
    announcements, 
    markLessonComplete 
  } = useData();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [examActive, setExamActive] = useState(false);
  const [examCurrentQIndex, setExamCurrentQIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, any>>({});
  const [examSecondsRemaining, setExamSecondsRemaining] = useState(0);
  const [profileSaved, setProfileSaved] = useState(false);

  const [selectedPayCourse, setSelectedPayCourse] = useState<any | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Student specific filtering
  const studentId = currentUser?.id || 'usr_student_01';
  const studentGrade = currentUser?.grade || 11;

  const myEnrollments = enrollments.filter(e => e.studentId === studentId && e.status === 'active');
  const enrolledGrades = myEnrollments.map(e => e.grade);
  const myCourses = courses.filter(c => enrolledGrades.includes(c.grade) || c.grade === studentGrade);

  const myProgress = lessonProgress.filter(p => p.studentId === studentId);
  const completedLessonsCount = myProgress.filter(p => p.completed).length;
  const gradeLessons = lessons.filter(l => l.grade === studentGrade);
  const progressPercent = gradeLessons.length > 0 
    ? Math.min(100, Math.round((completedLessonsCount / gradeLessons.length) * 100))
    : 0;

  const myAttendance = attendanceRecords.filter(a => a.studentId === studentId);
  const presentDays = myAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((presentDays / myAttendance.length) * 100) : 100;

  const myPayments = payments.filter(p => p.studentId === studentId);
  const myAttempts = examAttempts.filter(a => a.studentId === studentId);

  const gradeAnnouncements = announcements.filter(a => a.targetGrade === 'all' || a.targetGrade === studentGrade);

  // Exam timer logic
  useEffect(() => {
    let timer: any = null;
    if (examActive && examSecondsRemaining > 0) {
      timer = setInterval(() => {
        setExamSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examActive, examSecondsRemaining]);

  const handleStartExam = (exam: any) => {
    setSelectedExamId(exam.id);
    setExamCurrentQIndex(0);
    setExamAnswers({});
    setExamSecondsRemaining(exam.durationMinutes * 60);
    setExamActive(true);
  };

  const handleAutoSubmitExam = () => {
    if (!selectedExamId) return;
    const currentExam = exams.find(e => e.id === selectedExamId);
    const questions = examQuestions.filter(q => q.examId === selectedExamId);

    let earnedScore = 0;
    let totalExamMarks = 0;

    questions.forEach(q => {
      totalExamMarks += q.marks;
      const givenAns = examAnswers[q.id];
      if (q.type === 'mcq' && givenAns === q.correctOptionIndex) {
        earnedScore += q.marks;
      } else if (q.type === 'true_false' && givenAns === q.correctBoolean) {
        earnedScore += q.marks;
      }
    });

    const percent = totalExamMarks > 0 ? Math.round((earnedScore / totalExamMarks) * 100) : 0;
    const isPassed = percent >= (currentExam?.passPercentage || 45);

    submitExamAttempt({
      examId: selectedExamId,
      studentId,
      studentName: currentUser?.fullName || 'Student',
      startedAt: new Date(Date.now() - 600000).toISOString(),
      submittedAt: new Date().toISOString(),
      answers: examAnswers,
      score: earnedScore,
      percentage: percent,
      isPassed,
      status: 'graded',
      teacherFeedback: isPassed 
        ? 'Well done! Solid conceptual understanding of the syllabus.' 
        : 'Review the lecture notes and try the revision questions again.'
    });

    setExamActive(false);

    if (isPassed) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      
      {/* Top Banner Bar */}
      <div className="bg-[#0B1F4A] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={currentUser?.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F58220] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">
                  {t('dash.welcome')}, {currentUser?.fullName}!
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F58220] text-white">
                  Grade {studentGrade}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Student ID: {currentUser?.studentId || 'STU-2026-1102'} · {currentUser?.schoolName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/grade/${studentGrade}`)}
              className="px-4 py-2 bg-[#2563A6] hover:bg-[#1d4f85] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grade {studentGrade} Classroom</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 border border-white/20 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'lessons', label: 'Recorded Lessons', icon: Video },
                { id: 'live', label: 'Live Classes', icon: Calendar },
                { id: 'exams', label: 'Online Exams', icon: FileCheck },
                { id: 'results', label: 'My Results', icon: Award },
                { id: 'attendance', label: 'Attendance', icon: Clock },
                { id: 'progress', label: 'Progress Report', icon: BarChart3 },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'profile', label: 'Student Profile', icon: User },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setExamActive(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-[#0B1F4A] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-[#EAF3FC] hover:text-[#0B1F4A]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F58220]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick WhatsApp Tutor Inquiry */}
            <div className="bg-[#EAF3FC] border border-[#2563A6]/20 rounded-2xl p-4 text-xs space-y-2.5">
              <span className="font-bold text-[#0B1F4A] block">Need Academic Support?</span>
              <p className="text-[11px] text-slate-600">
                Direct WhatsApp contact with Hemantha Sir for difficult ICT questions.
              </p>
              <a
                href="https://wa.me/94772735518"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-[11px] shadow-xs"
              >
                <span>WhatsApp 077 273 5518</span>
              </a>
            </div>
          </div>

          {/* Right Content Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Metric KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Enrolled Course</span>
                    <div className="text-xl font-extrabold text-[#0B1F4A]">Grade {studentGrade} ICT</div>
                    <span className="text-[11px] text-[#2563A6] font-semibold">Active Enrollment</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Lesson Progress</span>
                    <div className="text-xl font-extrabold text-[#F58220]">{progressPercent}%</div>
                    <span className="text-[11px] text-slate-500">{completedLessonsCount} of {gradeLessons.length} Completed</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Attendance Rate</span>
                    <div className="text-xl font-extrabold text-emerald-600">{attendanceRate}%</div>
                    <span className="text-[11px] text-slate-500">{presentDays} Classes Attended</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Exams Taken</span>
                    <div className="text-xl font-extrabold text-[#0B1F4A]">{myAttempts.length}</div>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {myAttempts.length > 0 ? `${myAttempts[0].percentage}% Last Score` : 'No attempts yet'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#0B1F4A]">Overall Syllabus Completion</h3>
                      <p className="text-xs text-slate-500">Grade {studentGrade} Information & Communication Technology</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#F58220]">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#2563A6] to-[#F58220] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recent Lessons & Live Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Recent Lessons */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#0B1F4A]">Recent Recorded Lessons</h4>
                      <button 
                        onClick={() => setActiveTab('lessons')} 
                        className="text-xs text-[#2563A6] font-semibold hover:underline"
                      >
                        All Lessons →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {gradeLessons.slice(0, 3).map(l => (
                        <div 
                          key={l.id}
                          onClick={() => { setActiveTab('lessons'); }}
                          className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-[#2563A6]" />
                            <div>
                              <h5 className="font-semibold text-xs text-slate-900 line-clamp-1">{l.title}</h5>
                              <span className="text-[11px] text-slate-400">{l.durationMinutes} Minutes</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Live Classes */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#0B1F4A]">Next Live Classes</h4>
                      <span className="text-xs text-[#F58220] font-bold">Zoom Live</span>
                    </div>

                    <div className="space-y-2.5">
                      {liveClasses.filter(c => c.grade === studentGrade).map(c => (
                        <div key={c.id} className="p-3 rounded-xl bg-[#EAF3FC]/50 border border-[#2563A6]/20 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#0B1F4A]">{c.title}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{new Date(c.scheduledAt).toLocaleDateString()} at {new Date(c.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <a
                              href={c.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-[#F58220] hover:bg-[#e07519] text-white font-bold rounded-lg"
                            >
                              Join Zoom
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Grade Announcements */}
                {gradeAnnouncements.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-sm text-[#0B1F4A]">Important Grade Announcements</h4>
                    <div className="space-y-2">
                      {gradeAnnouncements.map(ann => (
                        <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{ann.title}</span>
                            <span className="text-slate-400 text-[11px]">{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-600">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 2. MY COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F4A]">My Enrolled Courses</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCourses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#2563A6] text-white text-xs font-bold">
                            Grade {course.grade} ICT
                          </span>
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Enrolled
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-[#0B1F4A]">{course.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">{course.lessonCount} Lessons Available</span>
                        <button
                          onClick={() => navigate(`/grade/${course.grade}`)}
                          className="px-4 py-2 bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold rounded-xl"
                        >
                          Open Course →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. RECORDED LESSONS TAB (VIDEO PLAYER & LESSONS LIST) */}
            {activeTab === 'lessons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F4A]">Recorded Video Lessons</h3>
                    <p className="text-xs text-slate-500">Grade {studentGrade} ICT High-Definition Video Lectures</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gradeLessons.map(lesson => {
                    const isDone = myProgress.some(p => p.lessonId === lesson.id && p.completed);
                    return (
                      <div
                        key={lesson.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#2563A6]">Lesson {lesson.orderIndex}</span>
                            <span className="text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {lesson.durationMinutes} mins
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#0B1F4A]">{lesson.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2">{lesson.description}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => markLessonComplete(studentId, lesson.id, !isDone)}
                            className={`text-xs font-bold flex items-center gap-1.5 ${
                              isDone ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>{isDone ? 'Finished' : 'Mark Done'}</span>
                          </button>

                          <button
                            onClick={() => navigate(`/grade/${lesson.grade}`)}
                            className="px-3 py-1.5 bg-[#0B1F4A] hover:bg-[#2563A6] text-white text-xs font-bold rounded-xl flex items-center gap-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-[#F58220]" />
                            <span>Watch Lecture</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. LIVE CLASSES TAB */}
            {activeTab === 'live' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F4A]">Live Virtual Classes</h3>
                    <p className="text-xs text-slate-500">Interactive Zoom & Google Meet sessions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {liveClasses.map(cls => (
                    <div
                      key={cls.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#0B1F4A] text-white font-bold">
                            Grade {cls.grade}
                          </span>
                          <span className="text-emerald-600 font-bold">{cls.platform} Virtual Hall</span>
                        </div>
                        <h4 className="font-bold text-base text-[#0B1F4A]">{cls.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{new Date(cls.scheduledAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>·</span>
                          <span>Duration: {cls.durationMinutes} Minutes</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cls.topics.map((t, idx) => (
                            <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 bg-[#F58220] hover:bg-[#e07519] text-white font-bold text-xs rounded-xl shadow-md text-center whitespace-nowrap"
                      >
                        Launch Live Class
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ONLINE EXAMS & ASSESSMENT (MCQ/TRUE-FALSE ENGINE) */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                {examActive ? (
                  /* Live Examination Taking Mode */
                  <div className="bg-white rounded-3xl border-2 border-[#2563A6] shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in">
                    
                    {/* Exam Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">Exam in Progress</span>
                        <h3 className="text-base font-bold text-[#0B1F4A]">
                          {exams.find(e => e.id === selectedExamId)?.title}
                        </h3>
                      </div>
                      
                      {/* Timer Display */}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-mono font-bold text-sm">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span>
                          {Math.floor(examSecondsRemaining / 60)}:{(examSecondsRemaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Question Content */}
                    {(() => {
                      const questions = examQuestions.filter(q => q.examId === selectedExamId);
                      const currentQ = questions[examCurrentQIndex];
                      if (!currentQ) return null;

                      return (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold">
                              Question {examCurrentQIndex + 1} of {questions.length}
                            </span>
                            <span className="font-semibold text-slate-700">{currentQ.marks} Marks</span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              {currentQ.questionText}
                            </h4>
                            {currentQ.questionTextSi && (
                              <p className="text-xs font-sinhala text-slate-600">
                                {currentQ.questionTextSi}
                              </p>
                            )}
                          </div>

                          {/* Options */}
                          {currentQ.type === 'mcq' && currentQ.options && (
                            <div className="space-y-2.5">
                              {currentQ.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => setExamAnswers(prev => ({ ...prev, [currentQ.id]: oIdx }))}
                                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                                    examAnswers[currentQ.id] === oIdx
                                      ? 'border-[#2563A6] bg-blue-50 text-[#0B1F4A] font-bold shadow-xs'
                                      : 'border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    examAnswers[currentQ.id] === oIdx ? 'border-[#2563A6] bg-[#2563A6]' : 'border-slate-300'
                                  }`}>
                                    {examAnswers[currentQ.id] === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {currentQ.type === 'true_false' && (
                            <div className="grid grid-cols-2 gap-4">
                              {[true, false].map((val) => (
                                <button
                                  key={String(val)}
                                  type="button"
                                  onClick={() => setExamAnswers(prev => ({ ...prev, [currentQ.id]: val }))}
                                  className={`p-4 rounded-xl border text-center text-xs font-bold transition-all ${
                                    examAnswers[currentQ.id] === val
                                      ? 'border-[#2563A6] bg-blue-50 text-[#2563A6]'
                                      : 'border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {val ? 'TRUE (සත්‍ය)' : 'FALSE (අසත්‍ය)'}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Navigation Buttons */}
                          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                            <button
                              disabled={examCurrentQIndex === 0}
                              onClick={() => setExamCurrentQIndex(prev => prev - 1)}
                              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
                            >
                              Previous Question
                            </button>

                            {examCurrentQIndex < questions.length - 1 ? (
                              <button
                                onClick={() => setExamCurrentQIndex(prev => prev + 1)}
                                className="px-5 py-2 bg-[#0B1F4A] text-white rounded-xl text-xs font-bold"
                              >
                                Next Question
                              </button>
                            ) : (
                              <button
                                onClick={handleAutoSubmitExam}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                              >
                                Final Submit & Grade Exam
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  /* Exams List */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#0B1F4A]">Available Online Exams</h3>
                        <p className="text-xs text-slate-500">Grade {studentGrade} Timed Assessments with Instant Marking</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {exams.filter(e => e.grade === studentGrade).map(exam => {
                        const previousAttempt = myAttempts.find(a => a.examId === exam.id);
                        return (
                          <div
                            key={exam.id}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EAF3FC] text-[#2563A6]">
                                  {exam.academicYear} Assessment
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                  {exam.durationMinutes} Minutes · {exam.totalMarks} Total Marks
                                </span>
                              </div>
                              <h4 className="font-bold text-base text-[#0B1F4A]">{exam.title}</h4>
                              <p className="text-xs text-slate-600">{exam.description}</p>

                              {previousAttempt && (
                                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Previously Attempted: {previousAttempt.score}/{exam.totalMarks} ({previousAttempt.percentage}%)</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleStartExam(exam)}
                              className="px-6 py-3 bg-[#F58220] hover:bg-[#e07519] text-white font-bold text-xs rounded-xl shadow-md whitespace-nowrap"
                            >
                              {previousAttempt ? 'Retake Exam' : 'Start Exam'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. RESULTS TAB */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F4A]">My Examination Results</h3>
                </div>

                <div className="space-y-4">
                  {myAttempts.map(attempt => {
                    const exam = exams.find(e => e.id === attempt.examId);
                    return (
                      <div key={attempt.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-400">Exam Assessment Result</span>
                            <h4 className="font-bold text-base text-[#0B1F4A]">{exam?.title || 'Online Exam'}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            attempt.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {attempt.isPassed ? 'PASSED (A Grade Standard)' : 'Needs Revision'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                          <div>
                            <span className="text-slate-400 text-[11px] block">Score</span>
                            <span className="text-lg font-bold text-[#0B1F4A]">{attempt.score} Marks</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[11px] block">Percentage</span>
                            <span className="text-lg font-bold text-[#2563A6]">{attempt.percentage}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[11px] block">Status</span>
                            <span className="text-lg font-bold text-emerald-600 font-mono">
                              {attempt.percentage >= 75 ? 'A (Distinction)' : attempt.percentage >= 65 ? 'B' : 'C'}
                            </span>
                          </div>
                        </div>

                        {attempt.teacherFeedback && (
                          <div className="p-3 bg-[#EAF3FC] rounded-xl text-xs text-[#0B1F4A] leading-relaxed">
                            <span className="font-bold">Teacher Feedback:</span> {attempt.teacherFeedback}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F4A]">Attendance Record</h3>
                    <p className="text-xs text-slate-500">Live Class and Physical Session Participation</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {attendanceRate}% Overall Attendance
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Class Session</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Verified By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myAttendance.map(att => (
                        <tr key={att.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3.5 font-bold text-slate-800">{att.classTitle}</td>
                          <td className="px-5 py-3.5 font-mono text-slate-500">{att.date}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              att.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {att.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">{att.markedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. PROGRESS REPORT TAB (PRINTABLE) */}
            {activeTab === 'progress' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                  <div>
                    <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">Academic Record</span>
                    <h3 className="text-xl font-bold text-[#0B1F4A]">Official Student Learning Progress Report</h3>
                    <p className="text-xs text-slate-500">Hemantha Wanninayake B.Sc - ICT Academy</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Student:</span>
                    <span className="font-bold text-slate-800">{currentUser?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Student ID:</span>
                    <span className="font-mono font-bold text-slate-800">{currentUser?.studentId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Grade:</span>
                    <span className="font-bold text-slate-800">Grade {studentGrade} ICT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">School:</span>
                    <span className="font-bold text-slate-800">{currentUser?.schoolName}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-xs uppercase text-slate-700">Detailed Performance Breakdown</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Course Completion ({completedLessonsCount}/{gradeLessons.length} Lessons)</span>
                        <span className="font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-[#2563A6] h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Attendance Reliability ({presentDays}/{myAttendance.length} Sessions)</span>
                        <span className="font-bold">{attendanceRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F4A]">Course Fee Payments</h3>
                    <p className="text-xs text-slate-500">PayHere Gateway & Verified Bank Receipts</p>
                  </div>
                  <button
                    onClick={() => {
                      const targetCourse = courses.find(c => c.grade === studentGrade);
                      setSelectedPayCourse(targetCourse);
                      setIsPayModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Make Course Payment</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Receipt No</th>
                        <th className="px-5 py-3">Course</th>
                        <th className="px-5 py-3">Method</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPayments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-800">{p.receiptNumber}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-700">{p.courseTitle}</td>
                          <td className="px-5 py-3.5 capitalize text-slate-600">{p.paymentMethod.replace('_', ' ')}</td>
                          <td className="px-5 py-3.5 font-bold text-[#0B1F4A]">LKR {p.amountLkr.toLocaleString()}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-slate-500">{p.paymentDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 10. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                <h3 className="text-lg font-bold text-[#0B1F4A]">My Student Profile</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={currentUser?.fullName}
                      onChange={(e) => updateProfile({ fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      defaultValue={currentUser?.phone}
                      onChange={(e) => updateProfile({ phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">School</label>
                    <input
                      type="text"
                      defaultValue={currentUser?.schoolName}
                      onChange={(e) => updateProfile({ schoolName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setProfileSaved(true);
                      setTimeout(() => setProfileSaved(false), 3000);
                    }}
                    className="px-6 py-2.5 bg-[#0B1F4A] hover:bg-[#163675] text-white text-xs font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                  {profileSaved && (
                    <span className="text-xs font-semibold text-emerald-600 animate-in fade-in">
                      ✓ Profile saved successfully
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* PayHere Modal if opened */}
      {selectedPayCourse && (
        <PayHereModal
          course={selectedPayCourse}
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
        />
      )}

    </div>
  );
};
