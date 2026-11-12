export type UserRole = 'student' | 'teacher' | 'admin';

export type GradeLevel = 6 | 7 | 8 | 9 | 10 | 11;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  studentId?: string;
  schoolName?: string;
  grade?: GradeLevel;
  avatarUrl?: string;
  createdAt: string;
  bio?: string;
}

export interface Course {
  id: string;
  grade: GradeLevel;
  title: string;
  titleSi: string;
  subtitle: string;
  description: string;
  descriptionSi: string;
  instructorName: string;
  instructorTitle: string;
  lessonCount: number;
  durationHours: number;
  monthlyFeeLkr: number;
  coverImage?: string;
  badge?: string;
  learningOutcomes: string[];
  syllabusOverview: string;
  featured?: boolean;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  titleSi: string;
  orderIndex: number;
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  fileType: 'pdf' | 'doc' | 'zip' | 'slide';
  fileUrl: string;
  fileSizeMb: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  chapterId: string;
  grade: GradeLevel;
  title: string;
  titleSi: string;
  description: string;
  videoUrl: string; // YouTube embed, Vimeo, or MP4
  durationMinutes: number;
  orderIndex: number;
  isFreePreview?: boolean;
  notesMarkdown?: string;
  resources: LessonResource[];
  quizId?: string;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  completed: boolean;
  lastWatchedSeconds: number;
  completedAt?: string;
  updatedAt: string;
}

export interface LiveClass {
  id: string;
  grade: GradeLevel;
  title: string;
  titleSi: string;
  instructorName: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink: string;
  platform: 'Zoom' | 'Google Meet' | 'YouTube Live';
  recordingUrl?: string;
  isCompleted?: boolean;
  topics: string[];
}

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  grade: GradeLevel;
  enrolledAt: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  expiryDate?: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'structured';

export interface ExamQuestion {
  id: string;
  examId: string;
  type: QuestionType;
  questionText: string;
  questionTextSi?: string;
  options?: string[]; // for mcq
  optionsSi?: string[];
  correctOptionIndex?: number; // 0,1,2,3 for mcq
  correctBoolean?: boolean; // for true_false
  modelAnswer?: string; // for structured
  marks: number;
  explanation?: string;
}

export interface OnlineExam {
  id: string;
  grade: GradeLevel;
  title: string;
  titleSi: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  startTime: string;
  endTime: string;
  isPublished: boolean;
  questionsCount: number;
  academicYear: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, any>; // questionId -> answer
  score: number;
  percentage: number;
  isPassed: boolean;
  status: 'in_progress' | 'submitted' | 'graded';
  teacherFeedback?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentIdentifier: string;
  grade: GradeLevel;
  classTitle: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  remarks?: string;
  markedBy: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentIdentifier: string;
  grade: GradeLevel;
  courseTitle: string;
  amountLkr: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'payhere_online';
  referenceNumber: string;
  receiptNumber: string;
  paymentDate: string;
  status: 'paid' | 'pending' | 'partial' | 'outstanding' | 'refunded';
  notes?: string;
  verifiedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleSi: string;
  content: string;
  contentSi: string;
  targetGrade: GradeLevel | 'all';
  authorName: string;
  authorRole: 'admin' | 'teacher';
  createdAt: string;
  isImportant?: boolean;
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface QuestionPaper {
  id: string;
  grade: GradeLevel;
  title: string;
  titleSi: string;
  paperType: 'Past Paper' | 'Model Paper' | 'Term Test' | 'Revision Paper';
  academicYear: string;
  term?: string;
  fileUrl: string;
  fileSizeMb: number;
  downloadCount: number;
  createdAt: string;
  isRestrictedToEnrolled: boolean;
}

export interface SupabaseRegistrationPayload {
  student_name: string;
  parent_name?: string | null;
  mobile: string;
  parent_mobile?: string | null;
  email: string;
  school_name?: string | null;
  current_grade: string | number;
  grade?: string | number;
  requested_grade: number | string;
  preferred_batch: string;
  additional_notes?: string | null;
  status?: string;
  created_at?: string;
}

export interface RegistrationRequest {
  id: string;
  studentFullName: string;
  parentName: string;
  studentMobile: string;
  parentMobile: string;
  email: string;
  schoolName: string;
  currentGrade: GradeLevel;
  requestedGrade: GradeLevel;
  academicYear: string;
  preferredClass: string;
  additionalMessage?: string;
  // Supabase column aliases
  student_name?: string;
  mobile?: string;
  preferred_batch?: string;
  additional_notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'enrolled';
  submittedAt: string;
  adminNotes?: string;
}

export interface StudentAchievement {
  id: string;
  studentName: string;
  photoUrl?: string;
  academicYear: string;
  grade: GradeLevel;
  examType: 'G.C.E. O/L ICT' | 'Term Test' | 'Provincial Olympiad';
  resultGrade: 'A' | 'B' | 'District 1st' | 'Z-Score Star';
  achievementText: string;
  testimonialText?: string;
  isAnonymous?: boolean;
  isPublished: boolean;
}

export interface InstructorProfile {
  name: string;
  degrees: string;
  title: string;
  photoUrl: string;
  bioEn: string;
  bioSi: string;
  qualifications: string[];
  experienceYears: number;
  specialization: string[];
  email: string;
  phone: string;
  locationUrl: string;
}
