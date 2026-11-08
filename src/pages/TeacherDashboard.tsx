import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { GradeLevel } from '../types';
import { 
  Users, 
  BookOpen, 
  Video, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  Award,
  Plus,
  Send
} from 'lucide-react';

interface TeacherDashboardProps {
  navigate: (path: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const { courses, lessons, attendanceRecords, recordAttendance, addLesson } = useData();

  const [activeTab, setActiveTab] = useState<'courses' | 'attendance' | 'new_lesson'>('courses');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(10);

  // New Lesson form state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://www.youtube.com/embed/5sS7w-CMHkU');
  const [lessonDuration, setLessonDuration] = useState(45);
  const [lessonDesc, setLessonDesc] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      
      {/* Top Banner */}
      <div className="bg-[#0B1F4A] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">Teacher & Lecturer Portal</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                  Academic Staff
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Welcome, {currentUser?.fullName}! Manage assigned curriculum and student attendance.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
          >
            Student LMS View
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'courses' ? 'bg-[#0B1F4A] text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#F58220]" />
                <span>Assigned Courses</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'attendance' ? 'bg-[#0B1F4A] text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Mark Attendance</span>
              </button>

              <button
                onClick={() => setActiveTab('new_lesson')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'new_lesson' ? 'bg-[#0B1F4A] text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Video className="w-4 h-4 text-[#2563A6]" />
                <span>Upload Lesson</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {activeTab === 'courses' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F4A]">Assigned Courses (Grades 6–11)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0B1F4A] text-white">
                        Grade {course.grade} ICT
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{course.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                      <button
                        onClick={() => navigate(`/grade/${course.grade}`)}
                        className="mt-2 text-xs font-bold text-[#2563A6] hover:underline"
                      >
                        Enter Course Page →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'new_lesson' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-5">
                <h3 className="text-lg font-bold text-[#0B1F4A]">Upload New Video Lesson</h3>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Grade</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(Number(e.target.value) as GradeLevel)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      {[6, 7, 8, 9, 10, 11].map(g => (
                        <option key={g} value={g}>Grade {g} ICT</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lesson Title</label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="e.g. Lesson 06: Python Dictionaries and File I/O"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Video Embed URL (YouTube / Vimeo / MP4)</label>
                    <input
                      type="url"
                      value={lessonVideoUrl}
                      onChange={(e) => setLessonVideoUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={lessonDesc}
                      onChange={(e) => setLessonDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!lessonTitle) return;
                      const course = courses.find(c => c.grade === selectedGrade);
                      addLesson({
                        courseId: course?.id || 'course-g11',
                        chapterId: 'ch-11-1',
                        grade: selectedGrade,
                        title: lessonTitle,
                        titleSi: lessonTitle,
                        description: lessonDesc,
                        videoUrl: lessonVideoUrl,
                        durationMinutes: lessonDuration,
                        orderIndex: lessons.filter(l => l.grade === selectedGrade).length + 1
                      });
                      setLessonTitle('');
                      setLessonDesc('');
                      setStatusMsg('Lesson published successfully to student LMS!');
                    }}
                    className="px-6 py-2.5 bg-[#F58220] hover:bg-[#e07519] text-white font-bold rounded-xl"
                  >
                    Publish Lesson
                  </button>

                  {statusMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                      ✓ {statusMsg}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#0B1F4A]">Quick Attendance Marking</h3>
                <p className="text-xs text-slate-500">Record attendance for today's live online class.</p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  Select students from your class roster and verify presence with one click.
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
