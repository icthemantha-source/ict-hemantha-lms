import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { GradeLevel, QuestionPaper, Announcement, RegistrationRequest } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Video, 
  FileCheck, 
  Award, 
  Calendar, 
  CreditCard, 
  Bell, 
  FolderDown, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  ShieldCheck, 
  Download,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  Send,
  Eye,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const { 
    courses, 
    lessons, 
    liveClasses, 
    enrollments, 
    exams, 
    examQuestions,
    examAttempts, 
    attendanceRecords, 
    recordAttendance, 
    payments, 
    addPayment, 
    updatePaymentStatus, 
    announcements, 
    addAnnouncement, 
    deleteAnnouncement, 
    questionPapers, 
    addQuestionPaper, 
    deleteQuestionPaper, 
    registrationRequests, 
    updateRegistrationStatus, 
    instructorProfile, 
    updateInstructorProfile, 
    addExam, 
    addLesson,
    deleteLesson,
    updateCourse
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'announcements' | 'papers' | 'requests' | 'payments' | 'attendance' | 'exams' | 'courses' | 'instructor'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Announcement State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnGrade, setNewAnnGrade] = useState<GradeLevel | 'all'>('all');
  const [newAnnImportant, setNewAnnImportant] = useState(false);

  // New Cash Payment State
  const [cashStudentName, setCashStudentName] = useState('');
  const [cashStudentId, setCashStudentId] = useState('STU-2026-');
  const [cashGrade, setCashGrade] = useState<GradeLevel>(11);
  const [cashAmount, setCashAmount] = useState('3000');
  const [cashMethod, setCashMethod] = useState<'cash' | 'bank_transfer'>('cash');
  const [cashRef, setCashRef] = useState('');

  // New Question Paper State
  const [paperTitle, setPaperTitle] = useState('');
  const [paperGrade, setPaperGrade] = useState<GradeLevel>(11);
  const [paperType, setPaperType] = useState<QuestionPaper['paperType']>('Past Paper');
  const [paperYear, setPaperYear] = useState('2025');
  const [paperRestricted, setPaperRestricted] = useState(false);

  // Attendance Marking State
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attGrade, setAttGrade] = useState<GradeLevel>(11);
  const [attClassTitle, setAttClassTitle] = useState('Grade 11 Zoom Class');

  // Search & Filter state
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<any | null>(null);

  // Calculate KPIs
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amountLkr, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pendingRequests = registrationRequests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F4A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#F58220] flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <span className="text-[#F58220]">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#0B1F4A] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F58220] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">Admin Management Console</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2563A6] text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Hemantha Wanninayake B.Sc - ICT Academy · Complete Academic & Financial Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
            >
              Switch to Student View
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold"
            >
              Website Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Admin Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
              {[
                { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
                { id: 'students', label: 'Students & Progress', icon: Users },
                { id: 'requests', label: 'Admissions & Requests', icon: UserCheck, badge: pendingRequests.length },
                { id: 'payments', label: 'Cash & Fee Payments', icon: DollarSign, badge: pendingPayments.length },
                { id: 'attendance', label: 'Attendance Register', icon: Clock },
                { id: 'announcements', label: 'Grade Announcements', icon: Bell },
                { id: 'papers', label: 'Question Papers (PDF)', icon: FolderDown },
                { id: 'exams', label: 'Exams & Question Bank', icon: FileCheck },
                { id: 'courses', label: 'Courses & Lessons', icon: BookOpen },
                { id: 'instructor', label: 'Instructor Profile', icon: Award },
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSelectedStudentForReport(null); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#0B1F4A] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-[#EAF3FC] hover:text-[#0B1F4A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F58220]' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {Boolean(tab.badge && tab.badge > 0) && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F58220] text-white">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Main Body (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. OVERVIEW & KPIS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue</span>
                    <div className="text-xl font-extrabold text-[#0B1F4A]">
                      LKR {totalRevenue.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">{payments.length} Verified Receipts</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Admission Inquiries</span>
                    <div className="text-xl font-extrabold text-[#F58220]">
                      {registrationRequests.length}
                    </div>
                    <span className="text-[11px] text-amber-600 font-semibold">{pendingRequests.length} Pending Approval</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Lessons</span>
                    <div className="text-xl font-extrabold text-[#2563A6]">
                      {lessons.length}
                    </div>
                    <span className="text-[11px] text-slate-500">Across Grades 6–11</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Question Papers</span>
                    <div className="text-xl font-extrabold text-[#0B1F4A]">
                      {questionPapers.length}
                    </div>
                    <span className="text-[11px] text-slate-500">Available for Download</span>
                  </div>
                </div>

                {/* Quick Action Matrix */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-[#0B1F4A]">Quick Academy Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2563A6] hover:bg-slate-50 text-left transition-colors"
                    >
                      <Bell className="w-5 h-5 text-[#2563A6] mb-1.5" />
                      <span className="text-xs font-bold text-slate-900 block">Post Announcement</span>
                      <span className="text-[10px] text-slate-500">Grade 6-11 notices</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('payments')}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-[#F58220] hover:bg-slate-50 text-left transition-colors"
                    >
                      <DollarSign className="w-5 h-5 text-[#F58220] mb-1.5" />
                      <span className="text-xs font-bold text-slate-900 block">Record Cash Fee</span>
                      <span className="text-[10px] text-slate-500">Manual payment receipt</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-slate-50 text-left transition-colors"
                    >
                      <Clock className="w-5 h-5 text-emerald-600 mb-1.5" />
                      <span className="text-xs font-bold text-slate-900 block">Mark Attendance</span>
                      <span className="text-[10px] text-slate-500">Class present register</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('papers')}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-slate-50 text-left transition-colors"
                    >
                      <FolderDown className="w-5 h-5 text-indigo-600 mb-1.5" />
                      <span className="text-xs font-bold text-slate-900 block">Upload Paper</span>
                      <span className="text-[10px] text-slate-500">O/L Past or Model</span>
                    </button>
                  </div>
                </div>

                {/* Pending Admission Requests Table Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0B1F4A]">Pending Registration Requests</h4>
                      <p className="text-xs text-slate-500">Prospective student applications awaiting approval</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-xs font-bold text-[#2563A6] hover:underline"
                    >
                      View All ({registrationRequests.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {registrationRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{req.studentFullName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FC] text-[#2563A6]">
                              Grade {req.requestedGrade}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">School: {req.schoolName} · Mobile: {req.studentMobile}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateRegistrationStatus(req.id, 'approved')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(req.id, 'rejected')}
                            className="px-2 py-1 text-slate-400 hover:text-red-600 text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. STUDENTS & INDIVIDUAL PROGRESS TRACKING (Section 28 C) */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F4A]">Student Performance & Progress Tracking</h3>
                    <p className="text-xs text-slate-500">Inspect individual lesson completion, exams, and attendance records</p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search students by name, school, or Student ID..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                {/* Detail modal/card if selected */}
                {selectedStudentForReport ? (
                  <div className="bg-white rounded-3xl border-2 border-[#2563A6] p-6 shadow-xl space-y-5 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-bold text-[#F58220] uppercase">Individual Progress Report</span>
                        <h4 className="text-lg font-bold text-[#0B1F4A]">{selectedStudentForReport.studentName}</h4>
                        <span className="text-xs text-slate-500 font-mono">ID: {selectedStudentForReport.studentIdentifier}</span>
                      </div>
                      <button
                        onClick={() => setSelectedStudentForReport(null)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50"
                      >
                        Close Report
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-center">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Attendance Records</span>
                        <span className="font-bold text-[#0B1F4A] text-base">
                          {attendanceRecords.filter(a => a.studentId === selectedStudentForReport.studentId).length} Sessions
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Exam Results Logged</span>
                        <span className="font-bold text-[#2563A6] text-base">
                          {examAttempts.filter(a => a.studentId === selectedStudentForReport.studentId).length} Attempts
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Fee Status</span>
                        <span className="font-bold text-emerald-600 text-base">Up to Date</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Students Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Student Name</th>
                        <th className="px-5 py-3">Student ID</th>
                        <th className="px-5 py-3">Grade</th>
                        <th className="px-5 py-3">Fee Status</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { studentId: 'usr_student_01', studentName: 'Kavindu Bandara', studentIdentifier: 'STU-2026-1102', grade: 11, feeStatus: 'Paid' },
                        { studentId: 'usr_student_02', studentName: 'Rashmi Senadeera', studentIdentifier: 'STU-2026-1108', grade: 11, feeStatus: 'Paid' },
                        { studentId: 'usr_student_03', studentName: 'Dinuka Fernando', studentIdentifier: 'STU-2026-1045', grade: 10, feeStatus: 'Paid' },
                        { studentId: 'usr_student_04', studentName: 'Nethmi Warnakulasooriya', studentIdentifier: 'STU-2026-0912', grade: 9, feeStatus: 'Pending' }
                      ].filter(s => s.studentName.toLowerCase().includes(studentSearch.toLowerCase())).map(s => (
                        <tr key={s.studentId} className="hover:bg-slate-50">
                          <td className="px-5 py-3.5 font-bold text-slate-900">{s.studentName}</td>
                          <td className="px-5 py-3.5 font-mono text-slate-500">{s.studentIdentifier}</td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#EAF3FC] text-[#2563A6]">
                              Grade {s.grade}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {s.feeStatus}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => setSelectedStudentForReport(s)}
                              className="px-3 py-1 bg-[#2563A6] hover:bg-[#1d4f85] text-white rounded-lg text-xs font-bold"
                            >
                              View Progress
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. GRADE-WISE ANNOUNCEMENTS & MESSAGING (Section 28 A) */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-[#0B1F4A]">Post New Grade Announcement</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Target Grade</label>
                      <select
                        value={newAnnGrade}
                        onChange={(e) => setNewAnnGrade(e.target.value === 'all' ? 'all' : (Number(e.target.value) as GradeLevel))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option value="all">Broadcast to All Grades (6–11)</option>
                        <option value={6}>Grade 6 Only</option>
                        <option value={7}>Grade 7 Only</option>
                        <option value={8}>Grade 8 Only</option>
                        <option value={9}>Grade 9 Only</option>
                        <option value={10}>Grade 10 Only</option>
                        <option value={11}>Grade 11 (O/L) Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Title</label>
                      <input
                        type="text"
                        value={newAnnTitle}
                        onChange={(e) => setNewAnnTitle(e.target.value)}
                        placeholder="e.g. O/L Model Paper Discussion Rescheduled"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Message Content (English / Sinhala)</label>
                      <textarea
                        rows={3}
                        value={newAnnContent}
                        onChange={(e) => setNewAnnContent(e.target.value)}
                        placeholder="Type message text..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAnnImportant}
                        onChange={(e) => setNewAnnImportant(e.target.checked)}
                        className="rounded text-[#F58220]"
                      />
                      <span className="font-semibold">Mark as High-Priority Notice</span>
                    </label>

                    <button
                      onClick={() => {
                        if (!newAnnTitle || !newAnnContent) return;
                        addAnnouncement({
                          title: newAnnTitle,
                          titleSi: newAnnTitle,
                          content: newAnnContent,
                          contentSi: newAnnContent,
                          targetGrade: newAnnGrade,
                          authorName: instructorProfile.name,
                          authorRole: 'admin',
                          isImportant: newAnnImportant
                        });
                        setNewAnnTitle('');
                        setNewAnnContent('');
                        showToast('Announcement published successfully!');
                      }}
                      className="px-5 py-2.5 bg-[#F58220] hover:bg-[#e07519] text-white text-xs font-bold rounded-xl flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast Announcement</span>
                    </button>
                  </div>
                </div>

                {/* Published Announcements List */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
                    Existing Published Announcements
                  </div>
                  <div className="divide-y divide-slate-100">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-4 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#0B1F4A]">{ann.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FC] text-[#2563A6]">
                              {ann.targetGrade === 'all' ? 'All Grades' : `Grade ${ann.targetGrade}`}
                            </span>
                            {ann.isImportant && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-red-100 text-red-700">
                                Priority
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{ann.content}</p>
                          <span className="text-[11px] text-slate-400 font-mono">{new Date(ann.createdAt).toLocaleString()}</span>
                        </div>

                        <button
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. CASH & MANUAL PAYMENT MANAGEMENT (Section 28 G) */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                
                {/* Record Manual Payment Form */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-[#0B1F4A]">Record Manual Cash / Bank Transfer Payment</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Full Name</label>
                      <input
                        type="text"
                        value={cashStudentName}
                        onChange={(e) => setCashStudentName(e.target.value)}
                        placeholder="e.g. Kasun Mihiranga"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student ID</label>
                      <input
                        type="text"
                        value={cashStudentId}
                        onChange={(e) => setCashStudentId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Course Grade</label>
                      <select
                        value={cashGrade}
                        onChange={(e) => setCashGrade(Number(e.target.value) as GradeLevel)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        {[6, 7, 8, 9, 10, 11].map(g => (
                          <option key={g} value={g}>Grade {g} ICT</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Amount (LKR)</label>
                      <input
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                      <select
                        value={cashMethod}
                        onChange={(e) => setCashMethod(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="cash">Direct Cash to Instructor</option>
                        <option value="bank_transfer">Bank Slip Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Reference / Note</label>
                      <input
                        type="text"
                        value={cashRef}
                        onChange={(e) => setCashRef(e.target.value)}
                        placeholder="Slip # or Receipt Note"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        if (!cashStudentName || !cashAmount) return;
                        addPayment({
                          studentId: 'usr_' + Date.now(),
                          studentName: cashStudentName,
                          studentIdentifier: cashStudentId,
                          grade: cashGrade,
                          courseTitle: `Grade ${cashGrade}: ICT Theory & Paper Class`,
                          amountLkr: Number(cashAmount),
                          paymentMethod: cashMethod,
                          referenceNumber: cashRef || 'DIRECT-CASH',
                          paymentDate: new Date().toISOString().split('T')[0],
                          status: 'paid',
                          notes: 'Manually issued and verified by Instructor Hemantha Wanninayake.'
                        });
                        setCashStudentName('');
                        setCashRef('');
                        showToast('Cash payment recorded and enrollment activated!');
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                    >
                      Issue Verified Receipt
                    </button>
                  </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
                    <span>All Recorded Payments & Receipts</span>
                    <span className="font-mono text-emerald-700 font-bold">Total: LKR {totalRevenue.toLocaleString()}</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Receipt No</th>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Method</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-mono font-bold text-slate-800">{p.receiptNumber}</td>
                          <td className="px-5 py-3">
                            <div className="font-bold text-slate-900">{p.studentName}</div>
                            <span className="text-[11px] text-slate-400">Grade {p.grade}</span>
                          </td>
                          <td className="px-5 py-3 capitalize">{p.paymentMethod.replace('_', ' ')}</td>
                          <td className="px-5 py-3 font-bold text-[#0B1F4A]">LKR {p.amountLkr.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {p.status === 'pending' && (
                              <button
                                onClick={() => updatePaymentStatus(p.id, 'paid')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                              >
                                Verify & Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* 5. ATTENDANCE MANAGEMENT (Section 28 H) */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-[#0B1F4A]">Mark Class Attendance</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Session Date</label>
                      <input
                        type="date"
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Select Grade</label>
                      <select
                        value={attGrade}
                        onChange={(e) => setAttGrade(Number(e.target.value) as GradeLevel)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        {[6, 7, 8, 9, 10, 11].map(g => (
                          <option key={g} value={g}>Grade {g} ICT</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Class Title</label>
                      <input
                        type="text"
                        value={attClassTitle}
                        onChange={(e) => setAttClassTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="font-bold text-xs uppercase text-slate-600 mb-2">Student Attendance List</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'usr_student_01', name: 'Kavindu Bandara', sid: 'STU-2026-1102' },
                        { id: 'usr_student_02', name: 'Rashmi Senadeera', sid: 'STU-2026-1108' },
                        { id: 'usr_student_03', name: 'Dinuka Fernando', sid: 'STU-2026-1045' },
                      ].map(st => (
                        <div key={st.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">{st.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{st.sid}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                recordAttendance({
                                  studentId: st.id,
                                  studentName: st.name,
                                  studentIdentifier: st.sid,
                                  grade: attGrade,
                                  classTitle: attClassTitle,
                                  date: attDate,
                                  status: 'present',
                                  markedBy: instructorProfile.name
                                });
                                showToast(`Marked ${st.name} Present`);
                              }}
                              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => {
                                recordAttendance({
                                  studentId: st.id,
                                  studentName: st.name,
                                  studentIdentifier: st.sid,
                                  grade: attGrade,
                                  classTitle: attClassTitle,
                                  date: attDate,
                                  status: 'absent',
                                  markedBy: instructorProfile.name
                                });
                                showToast(`Marked ${st.name} Absent`);
                              }}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-bold"
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. QUESTION PAPERS (Section 28 B) */}
            {activeTab === 'papers' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-[#0B1F4A]">Upload New Question Paper / Past Paper PDF</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Paper Title</label>
                      <input
                        type="text"
                        value={paperTitle}
                        onChange={(e) => setPaperTitle(e.target.value)}
                        placeholder="e.g. 2025 O/L ICT Provincial Mock Paper"
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Grade</label>
                      <select
                        value={paperGrade}
                        onChange={(e) => setPaperGrade(Number(e.target.value) as GradeLevel)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        {[6, 7, 8, 9, 10, 11].map(g => (
                          <option key={g} value={g}>Grade {g} ICT</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Paper Category</label>
                      <select
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="Past Paper">National Past Paper</option>
                        <option value="Model Paper">Hemantha Sir Model Paper</option>
                        <option value="Term Test">Provincial Term Test Paper</option>
                        <option value="Revision Paper">Target Revision Paper</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={paperYear}
                        onChange={(e) => setPaperYear(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paperRestricted}
                        onChange={(e) => setPaperRestricted(e.target.checked)}
                        className="rounded text-[#2563A6]"
                      />
                      <span>Restrict to Enrolled Students Only</span>
                    </label>

                    <button
                      onClick={() => {
                        if (!paperTitle) return;
                        addQuestionPaper({
                          grade: paperGrade,
                          title: paperTitle,
                          titleSi: paperTitle,
                          paperType: paperType,
                          academicYear: paperYear,
                          fileUrl: '/assets/sample-notes.pdf',
                          fileSizeMb: 2.4,
                          isRestrictedToEnrolled: paperRestricted
                        });
                        setPaperTitle('');
                        showToast('Question paper published!');
                      }}
                      className="px-6 py-2.5 bg-[#2563A6] hover:bg-[#1d4f85] text-white text-xs font-bold rounded-xl"
                    >
                      Publish Question Paper
                    </button>
                  </div>
                </div>

                {/* Existing Papers */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
                    Active Question Papers Archive ({questionPapers.length})
                  </div>
                  <div className="divide-y divide-slate-100">
                    {questionPapers.map(paper => (
                      <div key={paper.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#0B1F4A]">{paper.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FC] text-[#2563A6]">
                              Grade {paper.grade}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {paper.paperType} · {paper.academicYear} · {paper.downloadCount} Downloads
                          </span>
                        </div>

                        <button
                          onClick={() => deleteQuestionPaper(paper.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. ADMISSIONS & REGISTRATION REQUESTS (Section 28 D) */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F4A]">
                    Admission Requests ({registrationRequests.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {registrationRequests.map(req => (
                    <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-slate-900">{req.studentFullName}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {req.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Requested: Grade {req.requestedGrade} ICT · School: {req.schoolName}
                          </p>
                        </div>

                        <span className="text-xs font-mono text-slate-400">
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Parent Name</span>
                          <span className="font-semibold text-slate-800">{req.parentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Student Mobile</span>
                          <span className="font-mono font-bold text-[#2563A6]">{req.studentMobile}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Email</span>
                          <span className="text-slate-700">{req.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Batch</span>
                          <span className="text-slate-700 line-clamp-1">{req.preferredClass}</span>
                        </div>
                      </div>

                      {req.additionalMessage && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                          <span className="font-bold">Student Note:</span> {req.additionalMessage}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-2">
                        <a
                          href={`https://wa.me/94${req.studentMobile.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${req.studentFullName}, this is Hemantha Wanninayake B.Sc ICT Academy regarding your Grade ${req.requestedGrade} registration.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-bold"
                        >
                          WhatsApp Student
                        </a>
                        <button
                          onClick={() => updateRegistrationStatus(req.id, 'approved', 'Approved by administrator')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                        >
                          Approve Application
                        </button>
                        <button
                          onClick={() => updateRegistrationStatus(req.id, 'rejected', 'Declined')}
                          className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:text-red-600 rounded-xl text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. INSTRUCTOR PROFILE & PHOTO MANAGER (Section 28 F) */}
            {activeTab === 'instructor' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F4A]">Instructor Profile & Branding</h3>
                  <p className="text-xs text-slate-500">Manage instructor details displayed across home and course pages</p>
                </div>

                <div className="flex items-center gap-6 pb-4 border-b border-slate-200">
                  <img
                    src={instructorProfile.photoUrl}
                    alt={instructorProfile.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#F58220]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#0B1F4A]">{instructorProfile.name}</h4>
                    <p className="text-xs text-slate-500">{instructorProfile.title}</p>
                    <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                      Verified Studio Portrait Active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Instructor Name</label>
                    <input
                      type="text"
                      defaultValue={instructorProfile.name}
                      onChange={(e) => updateInstructorProfile({ name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Degrees & Titles</label>
                    <input
                      type="text"
                      defaultValue={instructorProfile.degrees}
                      onChange={(e) => updateInstructorProfile({ degrees: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">English Biography</label>
                    <textarea
                      rows={3}
                      defaultValue={instructorProfile.bioEn}
                      onChange={(e) => updateInstructorProfile({ bioEn: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1 font-sinhala">Sinhala Biography (සිංහල විස්තරය)</label>
                    <textarea
                      rows={3}
                      defaultValue={instructorProfile.bioSi}
                      onChange={(e) => updateInstructorProfile({ bioSi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 resize-none font-sinhala"
                    />
                  </div>
                </div>

                <button
                  onClick={() => showToast('Instructor profile updated successfully across the LMS!')}
                  className="px-6 py-2.5 bg-[#0B1F4A] hover:bg-[#163675] text-white text-xs font-bold rounded-xl"
                >
                  Save Profile Settings
                </button>
              </div>
            )}

            {/* 9. EXAMS & QUESTION BANK MANAGEMENT (Section 28 I) */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F4A]">Online Examinations & Question Bank</h3>
                    <p className="text-xs text-slate-500">Configure timed tests, auto-scoring MCQ and True/False questions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {exams.map(exam => (
                    <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0B1F4A]">{exam.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FC] text-[#2563A6]">
                            Grade {exam.grade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          {exam.durationMinutes} Minutes · {exam.totalMarks} Total Marks · {exam.questionsCount} Questions
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showToast(`Exam "${exam.title}" is published and live for students.`)}
                          className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl"
                        >
                          Published
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. COURSES & LESSON MANAGEMENT */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F4A]">Course Lesson Counts & Fees</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0B1F4A] text-white">
                          Grade {course.grade} ICT
                        </span>
                        <span className="text-xs font-bold text-[#F58220]">
                          LKR {course.monthlyFeeLkr.toLocaleString()} / mo
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{course.title}</h4>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-semibold text-slate-600">Lessons:</label>
                        <input
                          type="number"
                          defaultValue={course.lessonCount}
                          onChange={(e) => updateCourse(course.id, { lessonCount: Number(e.target.value) })}
                          className="w-16 p-1 text-xs border border-slate-300 rounded font-bold"
                        />
                        <button
                          onClick={() => navigate(`/grade/${course.grade}`)}
                          className="ml-auto text-xs font-bold text-[#2563A6] hover:underline"
                        >
                          View Classroom →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
