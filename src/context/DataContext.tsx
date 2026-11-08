import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  Chapter,
  Lesson,
  LessonProgress,
  LiveClass,
  CourseEnrollment,
  OnlineExam,
  ExamQuestion,
  ExamAttempt,
  AttendanceRecord,
  PaymentRecord,
  Announcement,
  QuestionPaper,
  RegistrationRequest,
  StudentAchievement,
  InstructorProfile,
  GradeLevel,
} from '../types';

interface DataContextType {
  courses: Course[];
  chapters: Chapter[];
  lessons: Lesson[];
  lessonProgress: LessonProgress[];
  liveClasses: LiveClass[];
  enrollments: CourseEnrollment[];
  exams: OnlineExam[];
  examQuestions: ExamQuestion[];
  examAttempts: ExamAttempt[];
  attendanceRecords: AttendanceRecord[];
  payments: PaymentRecord[];
  announcements: Announcement[];
  questionPapers: QuestionPaper[];
  registrationRequests: RegistrationRequest[];
  achievements: StudentAchievement[];
  instructorProfile: InstructorProfile;

  // Actions
  updateCourse: (id: string, updates: Partial<Course>) => void;
  enrollInCourse: (studentId: string, grade: GradeLevel) => void;
  markLessonComplete: (studentId: string, lessonId: string, completed: boolean) => void;
  saveLessonProgress: (studentId: string, lessonId: string, seconds: number) => void;
  submitExamAttempt: (attempt: Omit<ExamAttempt, 'id'>) => void;
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  bulkRecordAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => PaymentRecord;
  updatePaymentStatus: (id: string, status: PaymentRecord['status'], notes?: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  addQuestionPaper: (paper: Omit<QuestionPaper, 'id' | 'createdAt' | 'downloadCount'>) => void;
  deleteQuestionPaper: (id: string) => void;
  incrementPaperDownload: (id: string) => void;
  submitRegistrationRequest: (req: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'>) => void;
  updateRegistrationStatus: (id: string, status: RegistrationRequest['status'], adminNotes?: string) => void;
  addExam: (exam: Omit<OnlineExam, 'id'>, questions: Omit<ExamQuestion, 'id' | 'examId'>[]) => void;
  updateInstructorProfile: (updates: Partial<InstructorProfile>) => void;
  addLesson: (lesson: Omit<Lesson, 'id' | 'resources'>) => void;
  deleteLesson: (id: string) => void;
}

// Initial Realistic Seed Data
const INITIAL_COURSES: Course[] = [
  {
    id: 'course-g6',
    grade: 6,
    title: 'Grade 6: Fundamentals of ICT',
    titleSi: '6 ශ්‍රේණිය: තොරතුරු හා සන්නිවේදන තාක්ෂණ මූලධර්ම',
    subtitle: 'Basic computers, computer safety, typing & simple applications',
    description: 'A friendly and engaging foundation for junior secondary students. Learn about computer components, operating systems, digital safety, and beginner software.',
    descriptionSi: 'කනිෂ්ඨ සිසුන් සඳහා සරල හා ප්‍රායෝගික පරිගණක දැනුම, ආරක්ෂිත භාවිතය සහ මෘදුකාංග මූලිකාංග.',
    instructorName: 'Hemantha Wanninayake B.Sc',
    instructorTitle: 'Senior ICT Lecturer',
    lessonCount: 12,
    durationHours: 36,
    monthlyFeeLkr: 2000,
    badge: 'Junior Foundation',
    coverImage: '/src/assets/images/ict_classroom_lab_1794084339945.jpg',
    learningOutcomes: [
      'Identify hardware, software, and peripheral devices',
      'Understand data vs. information with practical examples',
      'Type accurately in English and Sinhala (Unicode)',
      'Practise cyber safety and healthy computer ergonomics'
    ],
    syllabusOverview: 'Term 1: Introduction to ICT · Term 2: Operating Systems & Files · Term 3: Word Processing Basics',
    featured: false
  },
  {
    id: 'course-g7',
    grade: 7,
    title: 'Grade 7: Digital Tools & Documents',
    titleSi: '7 ශ්‍රේණිය: ඩිජිටල් මෙවලම් සහ ලේඛන නිර්මාණය',
    subtitle: 'Word, Excel, presentations, and modern internet safety',
    description: 'Master practical office software, formatting documents, entering spreadsheet formulas, designing slideshows, and researching the web efficiently.',
    descriptionSi: 'කාර්යාලීය මෘදුකාංග (Word, Excel, PowerPoint), ගණනය කිරීම් සහ විශ්වසනීය අන්තර්ජාල භාවිතය.',
    instructorName: 'Hemantha Wanninayake B.Sc',
    instructorTitle: 'Senior ICT Lecturer',
    lessonCount: 14,
    durationHours: 42,
    monthlyFeeLkr: 2200,
    badge: 'Digital Literacy',
    coverImage: '/src/assets/images/ict_classroom_lab_1794084339945.jpg',
    learningOutcomes: [
      'Format professional documents and reports',
      'Use SUM, AVERAGE, and basic Excel formulas',
      'Create animated school presentations',
      'Evaluate credible web sources and search operators'
    ],
    syllabusOverview: 'Term 1: Word Processing · Term 2: Electronic Spreadsheets · Term 3: Electronic Presentations',
    featured: false
  },
  {
    id: 'course-g8',
    grade: 8,
    title: 'Grade 8: Internet & Communication',
    titleSi: '8 ශ්‍රේණිය: අන්තර්ජාලය සහ සන්නිවේදන තාක්ෂණය',
    subtitle: 'Email, online research, cloud safety, and digital collaboration',
    description: 'Explore the modern connected world. Deep dive into networking, client-server models, protocols, email ethics, and cloud collaboration tools.',
    descriptionSi: 'ජාලකරණය, සේවාදායක-සේවාදායක ආකෘති, විද්‍යුත් තැපෑල සහ සමකාලීන ක්ලවුඩ් මෙවලම්.',
    instructorName: 'Hemantha Wanninayake B.Sc',
    instructorTitle: 'Senior ICT Lecturer',
    lessonCount: 13,
    durationHours: 40,
    monthlyFeeLkr: 2400,
    badge: 'Connected World',
    coverImage: '/src/assets/images/ict_classroom_lab_1794084339945.jpg',
    learningOutcomes: [
      'Understand LAN, WAN, IP addresses, and DNS',
      'Send professional emails with attachments securely',
      'Identify malware, phishing, and cybersecurity threats',
      'Collaborate via online drives and cloud workspaces'
    ],
    syllabusOverview: 'Term 1: Computer Networks · Term 2: Internet & Services · Term 3: Social & Ethical Aspects',
    featured: false
  },
  {
    id: 'course-g9',
    grade: 9,
    title: 'Grade 9: ICT Fundamentals & Programming Basics',
    titleSi: '9 ශ්‍රේණිය: ICT මූලධර්ම සහ ක්‍රමලේඛන මූලිකාංග',
    subtitle: 'Computer logic, flowcharts, Scratch, and algorithmic problem-solving',
    description: 'Transition from digital user to creator. Understand algorithms, pseudocode, flowchart symbols, and hands-on block programming with Scratch.',
    descriptionSi: 'ඇල්ගොරිතම, ගැලීම් සටහන්, ව්‍යාජ කේත සහ Scratch මගින් මූලික පරිගණක වැඩසටහන් නිර්මාණය.',
    instructorName: 'Hemantha Wanninayake B.Sc',
    instructorTitle: 'Senior ICT Lecturer',
    lessonCount: 15,
    durationHours: 45,
    monthlyFeeLkr: 2500,
    badge: 'Coding Pioneer',
    coverImage: '/src/assets/images/hero_sri_lankan_student_1794084338373.jpg',
    learningOutcomes: [
      'Draw standard ISO flowcharts for computational problems',
      'Write clear pseudocode with loops and selection',
      'Develop 2D interactive stories and games in Scratch',
      'Understand binary number representations and logic gates'
    ],
    syllabusOverview: 'Term 1: Algorithms & Flowcharts · Term 2: Block Programming (Scratch) · Term 3: Logic Gates & Number Systems',
    featured: true
  },
  {
    id: 'course-g10',
    grade: 10,
    title: 'Grade 10: Data & Multimedia',
    titleSi: '10 ශ්‍රේණිය: දත්ත නිරූපණය සහ බහුමාධ්‍ය',
    subtitle: 'O/L Core syllabus: Architecture, Data Representation, and Graphic Design',
    description: 'Kickstart the G.C.E. O/L curriculum. Detailed breakdown of the Von Neumann model, binary/octal/hex conversions, sound & raster graphic editing, and basic HTML.',
    descriptionSi: 'සාමාන්‍ය පෙළ විෂය නිර්දේශයේ පරිගණක ගෘහනිර්මාණ ශිල්පය, සංඛ්‍යා පද්ධති, බහුමාධ්‍ය සහ මූලික වෙබ් නිර්මාණය.',
    instructorName: 'Hemantha Wanninayake B.Sc',
    instructorTitle: 'Senior ICT Lecturer',
    lessonCount: 16,
    durationHours: 52,
    monthlyFeeLkr: 2800,
    badge: 'O/L Stage 1',
    coverImage: '/src/assets/images/ict_classroom_lab_1794084339945.jpg',
    learningOutcomes: [
      'Convert between Binary, Octal, Decimal, and Hexadecimal',
      'Explain CPU registers, ALU, Control Unit, and memory hierarchy',
      'Design graphics using vector and bitmap techniques (GIMP/Photoshop)',
      'Code semantic web pages using HTML tags and CSS'
    ],
    syllabusOverview: 'Term 1: Computer Systems & Architecture · Term 2: Data Representation · Term 3: Multimedia & Web Development',
    featured: true
  },
  {
    id: 'course-g11',
    grade: 11,
    title: 'Grade 11: O/L Exam Preparation',
    titleSi: '11 ශ්‍රේණිය: අ.පො.ස (සා.පෙළ) විභාග පුනරීක්ෂණය සහ ප්‍රශ්න පත්‍ර සාකච්ඡාව',
    subtitle: 'Comprehensive revision, past papers (2016-2025), Python/Pascal, Database SQL',
    description: 'Targeted preparation for Grade 11 O/L candidates. Master relational databases, SQL queries, Python programming, systems analysis, and past paper model answers.',
    descriptionSi: 'O/L විභාගයේ විශිෂ්ට ‘A’ සාමාර්ථයක් සඳහා සවිස්තරාත්මක පුනරීක්ෂණය, Python ක්‍රමලේඛනය, දත්ත සමුදාය (Database SQL) සහ පසුගිය විභාග ප්‍රශ්න පත්‍ර.',
    instructorName: 'Hemantha Wanninayake B.Sc',
    instructorTitle: 'Senior ICT Lecturer',
    lessonCount: 20,
    durationHours: 64,
    monthlyFeeLkr: 3000,
    badge: 'O/L Masterclass',
    coverImage: '/src/assets/images/hero_sri_lankan_student_1794084338373.jpg',
    learningOutcomes: [
      'Solve full O/L ICT Paper I (40 MCQs) in under 45 minutes',
      'Write structured SQL queries (SELECT, INSERT, UPDATE, DELETE)',
      'Code algorithms in Python (variables, loops, conditions, lists)',
      'Master System Development Life Cycle (SDLC) questions'
    ],
    syllabusOverview: 'Term 1: Programming Concepts (Python) · Term 2: Relational Databases · Term 3: O/L Past Papers & Targeted Revision',
    featured: true
  }
];

const INITIAL_CHAPTERS: Chapter[] = [
  { id: 'ch-11-1', courseId: 'course-g11', title: 'Chapter 1: Programming Concepts (Python & Logic)', titleSi: '1 වන පරිච්ඡේදය: ක්‍රමලේඛන සංකල්ප (Python)', orderIndex: 1 },
  { id: 'ch-11-2', courseId: 'course-g11', title: 'Chapter 2: Relational Database Management Systems (RDBMS & SQL)', titleSi: '2 වන පරිච්ඡේදය: දත්ත සමුදාය කළමනාකරණය', orderIndex: 2 },
  { id: 'ch-11-3', courseId: 'course-g11', title: 'Chapter 3: System Development Life Cycle (SDLC)', titleSi: '3 වන පරිච්ඡේදය: පද්ධති සංවර්ධන ජීවන චක්‍රය', orderIndex: 3 },
  { id: 'ch-11-4', courseId: 'course-g11', title: 'Chapter 4: O/L Past Papers Deep Dive & Model Questions', titleSi: '4 වන පරිච්ඡේදය: පසුගිය විභාග ප්‍රශ්න පත්‍ර සාකච්ඡාව', orderIndex: 4 },

  { id: 'ch-10-1', courseId: 'course-g10', title: 'Chapter 1: Data Representation & Number Systems', titleSi: '1 වන පරිච්ඡේදය: සංඛ්‍යා පද්ධති', orderIndex: 1 },
  { id: 'ch-10-2', courseId: 'course-g10', title: 'Chapter 2: Computer Hardware & Architecture', titleSi: '2 වන පරිච්ඡේදය: පරිගණක ගෘහනිර්මාණ ශිල්පය', orderIndex: 2 },

  { id: 'ch-9-1', courseId: 'course-g9', title: 'Chapter 1: Logic Gates & Truth Tables', titleSi: '1 වන පරිච්ඡේදය: තාර්කික ද්වාර', orderIndex: 1 },
  { id: 'ch-9-2', courseId: 'course-g9', title: 'Chapter 2: Algorithmic Thinking & Scratch Coding', titleSi: '2 වන පරිච්ඡේදය: Scratch ක්‍රමලේඛනය', orderIndex: 2 },

  { id: 'ch-6-1', courseId: 'course-g6', title: 'Chapter 1: Getting Started with Computers', titleSi: '1 වන පරිච්ඡේදය: පරිගණක හඳුන්වාදීම', orderIndex: 1 },
  { id: 'ch-7-1', courseId: 'course-g7', title: 'Chapter 1: Word Processing & Spreadsheets', titleSi: '1 වන පරිච්ඡේදය: කාර්යාලීය මෘදුකාංග', orderIndex: 1 },
  { id: 'ch-8-1', courseId: 'course-g8', title: 'Chapter 1: The Internet and Cloud Technologies', titleSi: '1 වන පරිච්ඡේදය: අන්තර්ජාල තාක්ෂණය', orderIndex: 1 },
];

const INITIAL_LESSONS: Lesson[] = [
  // Grade 11 Lessons
  {
    id: 'les-11-01',
    courseId: 'course-g11',
    chapterId: 'ch-11-1',
    grade: 11,
    title: 'Lesson 01: Python Variables, Data Types & Operators',
    titleSi: 'පාඩම 01: Python විචල්‍යයන් සහ දත්ත වර්ග',
    description: 'Detailed analysis of numeric types, strings, input functions, and arithmetic operations in Python as per National O/L ICT curriculum.',
    videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
    durationMinutes: 48,
    orderIndex: 1,
    isFreePreview: true,
    notesMarkdown: `### Python Variables and Expressions\nIn Python, a variable is created the moment you first assign a value to it.\n\n\`\`\`python\nx = int(input("Enter number: "))\ny = 25\nprint("Total:", x + y)\n\`\`\`\n\n#### Key Rules for Identifiers:\n- Must begin with a letter (A-Z, a-z) or an underscore (_)\n- Case-sensitive (\`marks\` and \`Marks\` are different)\n- Cannot use reserved keywords like \`if\`, \`while\`, \`class\`.`,
    resources: [
      { id: 'res-11-01-a', lessonId: 'les-11-01', title: 'Python Basics Summary Notes (Grade 11).pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 1.8 }
    ]
  },
  {
    id: 'les-11-02',
    courseId: 'course-g11',
    chapterId: 'ch-11-1',
    grade: 11,
    title: 'Lesson 02: Control Structures — Conditional Statements (if/elif/else)',
    titleSi: 'පාඩම 02: කොන්දේසි සහිත ප්‍රකාශන (if/elif/else)',
    description: 'Learn how to implement decision-making logic in Python with flowcharts and practical code examples for grading systems.',
    videoUrl: 'https://www.youtube.com/embed/DZwmZ8Usvnk',
    durationMinutes: 52,
    orderIndex: 2,
    isFreePreview: false,
    notesMarkdown: `### Selection Control Structure\nAllows programs to choose alternate execution paths depending on boolean conditions.`,
    resources: [
      { id: 'res-11-02-a', lessonId: 'les-11-02', title: 'Decision Structures Handout.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 2.1 }
    ]
  },
  {
    id: 'les-11-03',
    courseId: 'course-g11',
    chapterId: 'ch-11-1',
    grade: 11,
    title: 'Lesson 03: Iteration Structures — while & for Loops with Range()',
    titleSi: 'පාඩම 03: පුනරාවර්තන ප්‍රකාශන (for & while ලූප)',
    description: 'Master repetition, calculating sums, finding maximum values, and iterating over lists.',
    videoUrl: 'https://www.youtube.com/embed/6iF8Xb7Z3wQ',
    durationMinutes: 55,
    orderIndex: 3,
    isFreePreview: false,
    resources: [
      { id: 'res-11-03-a', lessonId: 'les-11-03', title: 'Python Loop Exercise Sheet.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 1.5 }
    ]
  },
  {
    id: 'les-11-04',
    courseId: 'course-g11',
    chapterId: 'ch-11-2',
    grade: 11,
    title: 'Lesson 04: Database Fundamentals — Primary Keys & Foreign Keys',
    titleSi: 'පාඩම 04: ප්‍රාථමික යතුරු සහ ආගන්තුක යතුරු සංකල්ප',
    description: 'Understand entity relationship diagrams, table normalization, and relationship cardinality (1:1, 1:N, M:N).',
    videoUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc',
    durationMinutes: 44,
    orderIndex: 4,
    isFreePreview: false,
    resources: [
      { id: 'res-11-04-a', lessonId: 'les-11-04', title: 'RDBMS ER-Diagrams Handbook.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 3.2 }
    ]
  },
  {
    id: 'les-11-05',
    courseId: 'course-g11',
    chapterId: 'ch-11-2',
    grade: 11,
    title: 'Lesson 05: Practical SQL Queries — SELECT, WHERE, ORDER BY, JOIN',
    titleSi: 'පාඩම 05: ප්‍රායෝගික SQL විමසුම් ගොඩනැගීම',
    description: 'Write accurate SQL queries tested directly in O/L paper 2 questions.',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
    durationMinutes: 60,
    orderIndex: 5,
    isFreePreview: false,
    resources: [
      { id: 'res-11-05-a', lessonId: 'les-11-05', title: 'O/L SQL Question Bank with Answers.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 2.8 }
    ]
  },

  // Grade 10 Lessons
  {
    id: 'les-10-01',
    courseId: 'course-g10',
    chapterId: 'ch-10-1',
    grade: 10,
    title: 'Lesson 01: Binary, Octal & Hexadecimal Conversions Made Simple',
    titleSi: 'පාඩම 01: ද්විමය, අෂ්ටක සහ ෂඩ්දශමය සංඛ්‍යා පරිවර්තනය',
    description: 'Learn fast and foolproof table methods to convert binary numbers to decimal, octal, and hex without errors.',
    videoUrl: 'https://www.youtube.com/embed/5sS7w-CMHkU',
    durationMinutes: 46,
    orderIndex: 1,
    isFreePreview: true,
    resources: [
      { id: 'res-10-01-a', lessonId: 'les-10-01', title: 'Number Systems Conversion Sheet.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 1.2 }
    ]
  },
  {
    id: 'les-10-02',
    courseId: 'course-g10',
    chapterId: 'ch-10-2',
    grade: 10,
    title: 'Lesson 02: Von Neumann Architecture & CPU Bus Systems',
    titleSi: 'පාඩම 02: වොන් නියුමන් ආකෘතිය සහ CPU බස් පද්ධති',
    description: 'Examine Data Bus, Address Bus, Control Bus, registers (PC, MAR, MDR, IR), and CPU cache.',
    videoUrl: 'https://www.youtube.com/embed/cNN_tTXABUA',
    durationMinutes: 50,
    orderIndex: 2,
    isFreePreview: false,
    resources: [
      { id: 'res-10-02-a', lessonId: 'les-10-02', title: 'CPU Architecture Diagram.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 2.0 }
    ]
  },

  // Grade 9 Lessons
  {
    id: 'les-9-01',
    courseId: 'course-g9',
    chapterId: 'ch-9-1',
    grade: 9,
    title: 'Lesson 01: AND, OR, NOT Logic Gates and Truth Tables',
    titleSi: 'පාඩම 01: AND, OR, NOT තාර්කික ද්වාර සහ සත්‍යතා වගු',
    description: 'Build logic circuits and verify output signals using digital truth tables.',
    videoUrl: 'https://www.youtube.com/embed/gI-qXk7XojA',
    durationMinutes: 42,
    orderIndex: 1,
    isFreePreview: true,
    resources: [
      { id: 'res-9-01-a', lessonId: 'les-9-01', title: 'Logic Gates Worksheet.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 1.4 }
    ]
  },

  // Grade 6 Lessons
  {
    id: 'les-6-01',
    courseId: 'course-g6',
    chapterId: 'ch-6-1',
    grade: 6,
    title: 'Lesson 01: Exploring the Computer — Input, Output & Storage',
    titleSi: 'පාඩම 01: පරිගණකයක මූලික උපාංග හඳුනාගැනීම',
    description: 'Learn the difference between input, output, and secondary storage devices in everyday life.',
    videoUrl: 'https://www.youtube.com/embed/A8gZ2HnJgB8',
    durationMinutes: 35,
    orderIndex: 1,
    isFreePreview: true,
    resources: [
      { id: 'res-6-01-a', lessonId: 'les-6-01', title: 'Grade 6 Computer Parts Guide.pdf', fileType: 'pdf', fileUrl: '/assets/sample-notes.pdf', fileSizeMb: 1.1 }
    ]
  }
];

const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-01',
    grade: 11,
    title: 'Grade 11 Live: O/L Past Paper 2024 Structured Discussion',
    titleSi: '11 ශ්‍රේණිය සජීවී: 2024 O/L ප්‍රශ්න පත්‍ර සාකච්ඡාව',
    instructorName: 'Hemantha Wanninayake B.Sc',
    scheduledAt: '2026-11-15T09:30:00Z',
    durationMinutes: 90,
    meetingLink: 'https://zoom.us/j/94772735518?pwd=ICTHEMANTHALMS',
    platform: 'Zoom',
    topics: ['Python Algorithm Questions', 'Relational Database Queries', 'Flowchart Tracing']
  },
  {
    id: 'live-02',
    grade: 10,
    title: 'Grade 10 Live: Logic Gate Circuit Simplification',
    titleSi: '10 ශ්‍රේණිය සජීවී: තාර්කික ද්වාර පරිපථ සරල කිරීම',
    instructorName: 'Hemantha Wanninayake B.Sc',
    scheduledAt: '2026-11-16T14:00:00Z',
    durationMinutes: 75,
    meetingLink: 'https://zoom.us/j/94772735518?pwd=ICTHEMANTHALMS',
    platform: 'Zoom',
    topics: ['Truth Tables', 'Compound Gates (NAND, NOR)', 'O/L Model Problems']
  },
  {
    id: 'live-03',
    grade: 9,
    title: 'Grade 9 Live: Scratch Game Animation & Variables',
    titleSi: '9 ශ්‍රේණිය සජීවී: Scratch ක්‍රීඩා නිර්මාණය',
    instructorName: 'Hemantha Wanninayake B.Sc',
    scheduledAt: '2026-11-18T16:00:00Z',
    durationMinutes: 60,
    meetingLink: 'https://zoom.us/j/94772735518?pwd=ICTHEMANTHALMS',
    platform: 'Google Meet',
    topics: ['Broadcasting messages', 'Score counters', 'Sprite movement physics']
  }
];

const INITIAL_EXAMS: OnlineExam[] = [
  {
    id: 'exam-11-01',
    grade: 11,
    title: 'Grade 11 Term 2 ICT Evaluation: Python & RDBMS (Speed MCQ)',
    titleSi: '11 ශ්‍රේණිය 2 වන වාර ඇගයීම: Python සහ දත්ත සමුදාය',
    description: 'Timed assessment featuring 10 multiple-choice questions with automatic grading and immediate score calculation.',
    durationMinutes: 20,
    totalMarks: 50,
    passPercentage: 50,
    startTime: '2026-11-01T08:00:00Z',
    endTime: '2026-12-31T23:59:59Z',
    isPublished: true,
    questionsCount: 5,
    academicYear: '2026'
  },
  {
    id: 'exam-10-01',
    grade: 10,
    title: 'Grade 10 Number Systems & Boolean Logic Benchmark',
    titleSi: '10 ශ්‍රේණිය සංඛ්‍යා පද්ධති සහ තාර්කික ද්වාර පරීක්ෂණය',
    description: 'Covers Binary conversions and Truth Table evaluation.',
    durationMinutes: 30,
    totalMarks: 40,
    passPercentage: 45,
    startTime: '2026-11-05T08:00:00Z',
    endTime: '2026-12-31T23:59:59Z',
    isPublished: true,
    questionsCount: 4,
    academicYear: '2026'
  }
];

const INITIAL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q-1',
    examId: 'exam-11-01',
    type: 'mcq',
    questionText: 'What is the output of the following Python expression: print(17 // 4, 17 % 4)?',
    questionTextSi: 'print(17 // 4, 17 % 4) යන Python ප්‍රකාශනයේ ප්‍රතිදානය කුමක්ද?',
    options: ['4.25 1', '4 1', '4 4', '4.0 1.0'],
    optionsSi: ['4.25 1', '4 1', '4 4', '4.0 1.0'],
    correctOptionIndex: 1,
    marks: 10,
    explanation: '// performs integer floor division (17 // 4 = 4) and % calculates the modulus/remainder (17 % 4 = 1).'
  },
  {
    id: 'q-2',
    examId: 'exam-11-01',
    type: 'mcq',
    questionText: 'Which SQL keyword is used to extract unique values from a column without duplicates?',
    questionTextSi: 'තීරුවකින් අනුපිටපත් නොවන අනන්‍ය අගයන් ලබාගැනීමට භාවිතා කරන SQL වචනය කුමක්ද?',
    options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'PRIMARY'],
    optionsSi: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'PRIMARY'],
    correctOptionIndex: 1,
    marks: 10,
    explanation: 'The SELECT DISTINCT statement is used to return only distinct (different) values.'
  },
  {
    id: 'q-3',
    examId: 'exam-11-01',
    type: 'true_false',
    questionText: 'A primary key in a relational database table can contain NULL values.',
    questionTextSi: 'දත්ත සමුදා වගුවක ප්‍රාථමික යතුරක් සඳහා NULL අගයන් පැවතිය හැක.',
    correctBoolean: false,
    marks: 10,
    explanation: 'Primary keys must be UNIQUE and NOT NULL by definition.'
  },
  {
    id: 'q-4',
    examId: 'exam-11-01',
    type: 'mcq',
    questionText: 'What is the correct syntax to create a function in Python?',
    questionTextSi: 'Python හි ශ්‍රිතයක් (Function) නිර්මාණය කිරීමට නිවැරදි වාක්‍ය ඛණ්ඩය කුමක්ද?',
    options: ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'],
    optionsSi: ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'],
    correctOptionIndex: 1,
    marks: 10,
    explanation: 'Python uses the "def" keyword to declare functions.'
  },
  {
    id: 'q-5',
    examId: 'exam-11-01',
    type: 'true_false',
    questionText: 'In Python, strings are mutable and can be modified in-place.',
    questionTextSi: 'Python හි strings (පාඨ) වෙනස් කළ හැකි (mutable) දත්ත වර්ගයකි.',
    correctBoolean: false,
    marks: 10,
    explanation: 'Strings in Python are immutable; any modification creates a new string object.'
  }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', studentId: 'usr_student_01', studentName: 'Kavindu Bandara', studentIdentifier: 'STU-2026-1102', grade: 11, classTitle: 'Grade 11 Theory: Python Algorithms', date: '2026-11-01', status: 'present', markedBy: 'Hemantha Wanninayake B.Sc' },
  { id: 'att-2', studentId: 'usr_student_01', studentName: 'Kavindu Bandara', studentIdentifier: 'STU-2026-1102', grade: 11, classTitle: 'Grade 11 Live: RDBMS & SQL Paper Prep', date: '2026-11-03', status: 'present', markedBy: 'Hemantha Wanninayake B.Sc' },
  { id: 'att-3', studentId: 'usr_student_01', studentName: 'Kavindu Bandara', studentIdentifier: 'STU-2026-1102', grade: 11, classTitle: 'Grade 11 Past Paper Discussion 2023', date: '2026-11-05', status: 'late', remarks: 'Joined 10 mins late due to connectivity', markedBy: 'Hemantha Wanninayake B.Sc' },
  { id: 'att-4', studentId: 'usr_student_02', studentName: 'Rashmi Senadeera', studentIdentifier: 'STU-2026-1108', grade: 11, classTitle: 'Grade 11 Theory: Python Algorithms', date: '2026-11-01', status: 'present', markedBy: 'Hemantha Wanninayake B.Sc' },
  { id: 'att-5', studentId: 'usr_student_03', studentName: 'Dinuka Fernando', studentIdentifier: 'STU-2026-1045', grade: 10, classTitle: 'Grade 10 Number Systems & Boolean Logic', date: '2026-11-02', status: 'present', markedBy: 'Hemantha Wanninayake B.Sc' },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-001',
    studentId: 'usr_student_01',
    studentName: 'Kavindu Bandara',
    studentIdentifier: 'STU-2026-1102',
    grade: 11,
    courseTitle: 'Grade 11: O/L Exam Preparation',
    amountLkr: 3000,
    paymentMethod: 'payhere_online',
    referenceNumber: 'PH-2026-88912',
    receiptNumber: 'REC-2026-1101',
    paymentDate: '2026-11-01',
    status: 'paid',
    notes: 'PayHere Online Gateway payment verified successfully.'
  },
  {
    id: 'pay-002',
    studentId: 'usr_student_02',
    studentName: 'Rashmi Senadeera',
    studentIdentifier: 'STU-2026-1108',
    grade: 11,
    courseTitle: 'Grade 11: O/L Exam Preparation',
    amountLkr: 3000,
    paymentMethod: 'cash',
    referenceNumber: 'CASH-REC-044',
    receiptNumber: 'REC-2026-1102',
    paymentDate: '2026-11-02',
    status: 'paid',
    notes: 'Received in person at academy office.'
  },
  {
    id: 'pay-003',
    studentId: 'usr_student_03',
    studentName: 'Dinuka Fernando',
    studentIdentifier: 'STU-2026-1045',
    grade: 10,
    courseTitle: 'Grade 10: Data & Multimedia',
    amountLkr: 2800,
    paymentMethod: 'bank_transfer',
    referenceNumber: 'BOC-TX-990142',
    receiptNumber: 'REC-2026-1003',
    paymentDate: '2026-11-04',
    status: 'paid',
    notes: 'Bank of Ceylon transfer verified via receipt slip.'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Grade 11: O/L 2026 Final Model Paper Revision Schedule',
    titleSi: '11 ශ්‍රේණිය: 2026 O/L ආදර්ශ ප්‍රශ්න පත්‍ර සාකච්ඡා කාලසටහන',
    content: 'Special online masterclasses will begin this Saturday at 8:00 AM on Zoom. Please review chapters 1 to 4 and have the downloaded PDF ready.',
    contentSi: 'එළඹෙන සෙනසුරාදා පෙ.ව. 8.00 ට Zoom හරහා විශේෂ ආදර්ශ ප්‍රශ්න පත්‍ර සාකච්ඡාව ආරම්භ වේ. බාගත කළ PDF ප්‍රශ්න පත්‍රය සූදානම් කර තබාගන්න.',
    targetGrade: 11,
    authorName: 'Hemantha Wanninayake B.Sc',
    authorRole: 'admin',
    createdAt: '2026-11-06T10:00:00Z',
    isImportant: true,
    attachmentName: 'OL_Model_Revision_Schedule_2026.pdf',
    attachmentUrl: '/assets/sample-notes.pdf'
  },
  {
    id: 'ann-2',
    title: 'All Grades: Annual ICT Innovation Project Submissions',
    titleSi: 'සියලු ශ්‍රේණි සඳහා: වාර්ෂික ICT නව නිපැයුම් ව්‍යාපෘති භාරගැනීම',
    content: 'Students from Grade 6 to 11 can now submit their digital art, websites, or Scratch games for the Academy Awards.',
    contentSi: '6 සිට 11 ශ්‍රේණි දක්වා සියලුම සිසුන්ට තම ඩිජිටල් නිර්මාණ, වෙබ් අඩවි හෝ Scratch ක්‍රීඩා ඉදිරිපත් කළ හැක.',
    targetGrade: 'all',
    authorName: 'Hemantha Wanninayake B.Sc',
    authorRole: 'admin',
    createdAt: '2026-11-04T12:00:00Z',
    isImportant: false
  },
  {
    id: 'ann-3',
    title: 'Grade 10: Practical HTML & Web Design Homework Due Friday',
    titleSi: '10 ශ්‍රේණිය: ප්‍රායෝගික HTML වෙබ් නිර්මාණ පැවරුම',
    content: 'Submit your student portfolio webpage code via the dashboard portal before midnight.',
    contentSi: 'ඔබගේ ශිෂ්‍ය කළඹ වෙබ් පිටුව සිකුරාදා මධ්‍යම රාත්‍රියට පෙර ඉදිරිපත් කරන්න.',
    targetGrade: 10,
    authorName: 'Anura Senanayake B.Sc',
    authorRole: 'teacher',
    createdAt: '2026-11-05T09:00:00Z',
    isImportant: false
  }
];

const INITIAL_PAPERS: QuestionPaper[] = [
  {
    id: 'paper-1',
    grade: 11,
    title: 'G.C.E. O/L ICT 2024 Past Paper with Marking Scheme',
    titleSi: '2024 අ.පො.ස (සා.පෙළ) ICT පසුගිය විභාග ප්‍රශ්න පත්‍රය සහ ලකුණු දීමේ පටිපාටිය',
    paperType: 'Past Paper',
    academicYear: '2024',
    fileUrl: '/assets/sample-notes.pdf',
    fileSizeMb: 3.4,
    downloadCount: 412,
    createdAt: '2025-02-10T00:00:00Z',
    isRestrictedToEnrolled: false
  },
  {
    id: 'paper-2',
    grade: 11,
    title: 'G.C.E. O/L ICT 2023 Past Paper (English & Sinhala Medium)',
    titleSi: '2023 අ.පො.ස (සා.පෙළ) ICT පසුගිය විභාග ප්‍රශ්න පත්‍රය',
    paperType: 'Past Paper',
    academicYear: '2023',
    fileUrl: '/assets/sample-notes.pdf',
    fileSizeMb: 2.9,
    downloadCount: 520,
    createdAt: '2024-03-15T00:00:00Z',
    isRestrictedToEnrolled: false
  },
  {
    id: 'paper-3',
    grade: 11,
    title: '2026 O/L Target Model Paper — Paper I & II (Prepared by Hemantha Sir)',
    titleSi: '2026 O/L ඉලක්කගත ආදර්ශ ප්‍රශ්න පත්‍රය — හේමන්ත සර් විසින් සකස් කරන ලද',
    paperType: 'Model Paper',
    academicYear: '2026',
    fileUrl: '/assets/sample-notes.pdf',
    fileSizeMb: 4.1,
    downloadCount: 388,
    createdAt: '2026-10-18T00:00:00Z',
    isRestrictedToEnrolled: true
  },
  {
    id: 'paper-4',
    grade: 10,
    title: 'Grade 10 Provincial 2nd Term Evaluation Test Paper',
    titleSi: '10 ශ්‍රේණිය පළාත් 2 වන වාර ඇගයීම් ප්‍රශ්න පත්‍රය',
    paperType: 'Term Test',
    academicYear: '2025',
    term: 'Term 2',
    fileUrl: '/assets/sample-notes.pdf',
    fileSizeMb: 2.1,
    downloadCount: 290,
    createdAt: '2025-08-20T00:00:00Z',
    isRestrictedToEnrolled: false
  },
  {
    id: 'paper-5',
    grade: 9,
    title: 'Grade 9 Algorithms & Scratch Unit Test Paper',
    titleSi: '9 ශ්‍රේණිය ඇල්ගොරිතම සහ Scratch ඒකක පරීක්ෂණය',
    paperType: 'Revision Paper',
    academicYear: '2025',
    fileUrl: '/assets/sample-notes.pdf',
    fileSizeMb: 1.6,
    downloadCount: 185,
    createdAt: '2025-09-12T00:00:00Z',
    isRestrictedToEnrolled: false
  }
];

const INITIAL_REQUESTS: RegistrationRequest[] = [
  {
    id: 'req-01',
    studentFullName: 'Senura Wickramasinghe',
    parentName: 'Gamini Wickramasinghe',
    studentMobile: '0771122334',
    parentMobile: '0714455667',
    email: 'senura.wick@gmail.com',
    schoolName: 'Royal College, Colombo',
    currentGrade: 10,
    requestedGrade: 11,
    academicYear: '2026',
    preferredClass: 'Sunday Morning Online Zoom Class (8:30 AM - 11:30 AM)',
    additionalMessage: 'Preparing for 2026 O/L examination and need comprehensive revision in Python.',
    status: 'pending',
    submittedAt: '2026-11-06T15:30:00Z'
  },
  {
    id: 'req-02',
    studentFullName: 'Tharushi Jayasuriya',
    parentName: 'Nimali Jayasuriya',
    studentMobile: '0729988776',
    parentMobile: '0776655443',
    email: 'tharushi.j@gmail.com',
    schoolName: 'Visakha Vidyalaya',
    currentGrade: 9,
    requestedGrade: 10,
    academicYear: '2026',
    preferredClass: 'Saturday Evening Zoom Class (4:00 PM - 6:30 PM)',
    status: 'approved',
    submittedAt: '2026-11-04T11:20:00Z',
    adminNotes: 'Contacted parent via WhatsApp. Approved for batch 10-A.'
  }
];

const INITIAL_ACHIEVEMENTS: StudentAchievement[] = [
  {
    id: 'ach-1',
    studentName: 'Methmi Nethmini',
    academicYear: '2024 O/L',
    grade: 11,
    examType: 'G.C.E. O/L ICT',
    resultGrade: 'A',
    achievementText: 'Scored 96 marks in O/L ICT with an exceptional distinction.',
    testimonialText: '"Hemantha Sir explains Python algorithms and database logic so clearly. His past paper model discussions gave me the highest confidence in the examination hall!"',
    isAnonymous: false,
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'ach-2',
    studentName: 'Charith Disanayake',
    academicYear: '2024 O/L',
    grade: 11,
    examType: 'G.C.E. O/L ICT',
    resultGrade: 'A',
    achievementText: 'Secured District 3rd Rank in Kurunegala district for ICT.',
    testimonialText: '"The online mock exams and LMS notes covered exactly what appeared on the national paper. Best ICT class in Sri Lanka!"',
    isAnonymous: false,
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'ach-3',
    studentName: 'Nisali Alwis',
    academicYear: '2023 O/L',
    grade: 11,
    examType: 'G.C.E. O/L ICT',
    resultGrade: 'A',
    achievementText: 'Achieved an "A" Grade after improving from 42 marks in Term 1.',
    testimonialText: '"Sir helped me overcome my fear of flowchart logic and SQL queries. Grateful to Hemantha Academy!"',
    isAnonymous: false,
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  }
];

const INITIAL_INSTRUCTOR: InstructorProfile = {
  name: 'Hemantha Wanninayake B.Sc',
  degrees: 'B.Sc (Hons) in Information Technology',
  title: 'Senior ICT Lecturer, Curriculum Specialist & Founder',
  photoUrl: '/src/assets/images/instructor_hemantha_1794084339711.jpg',
  bioEn: 'Hemantha Wanninayake B.Sc is one of Sri Lanka’s leading ICT educators with more than 14 years of teaching experience. Having mentored over 8,500 students across Grades 6 through 11, his methodology emphasizes hands-on algorithmic problem solving, clear conceptual mastery, and thorough past paper training that consistently yields 92%+ "A" pass rates in national examinations.',
  bioSi: 'හේමන්ත වන්නිනායක (B.Sc) මහතා වසර 14කට අධික කාලයක් පුරා දිවයිනේ දහස් ගණනක් සිසුන්ට තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT) විෂය සරලව හා ප්‍රායෝගිකව උගන්වමින් O/L විභාගයේ විශිෂ්ටතම ප්‍රතිඵල ලබාදුන් ප්‍රවීණ දේශකයෙකි.',
  qualifications: [
    'Bachelor of Science (B.Sc Hons) in Information Technology',
    'National Diploma in Teaching (Information Technology)',
    'Certified Python & Database Architecture Instructor',
    '14+ Consecutive Years of G.C.E. O/L ICT Paper Analysis'
  ],
  experienceYears: 14,
  specialization: [
    'G.C.E. O/L ICT Examination Strategy',
    'Python & Computational Thinking',
    'Relational Databases & SQL',
    'Computer Architecture & Binary Logic',
    'Junior Grade Digital Foundations'
  ],
  email: 'icthemantha@gmail.com',
  phone: '0772735518',
  locationUrl: 'https://maps.app.goo.gl/QdtHZKfNFxx9B57LA?g_st=aw'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ict_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [chapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('ict_chapters');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('ict_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>(() => {
    const saved = localStorage.getItem('ict_progress');
    return saved ? JSON.parse(saved) : [
      { id: 'prog-1', studentId: 'usr_student_01', lessonId: 'les-11-01', completed: true, lastWatchedSeconds: 2800, updatedAt: new Date().toISOString() },
      { id: 'prog-2', studentId: 'usr_student_01', lessonId: 'les-11-02', completed: true, lastWatchedSeconds: 3100, updatedAt: new Date().toISOString() },
    ];
  });

  const [liveClasses] = useState<LiveClass[]>(INITIAL_LIVE_CLASSES);

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>(() => {
    const saved = localStorage.getItem('ict_enrollments');
    return saved ? JSON.parse(saved) : [
      { id: 'enr-1', studentId: 'usr_student_01', courseId: 'course-g11', grade: 11, enrolledAt: '2026-01-10T08:00:00Z', status: 'active' },
      { id: 'enr-2', studentId: 'usr_student_01', courseId: 'course-g10', grade: 10, enrolledAt: '2025-01-15T08:00:00Z', status: 'active' }
    ];
  });

  const [exams, setExams] = useState<OnlineExam[]>(() => {
    const saved = localStorage.getItem('ict_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>(() => {
    const saved = localStorage.getItem('ict_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem('ict_attempts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'att-usr-01',
        examId: 'exam-11-01',
        studentId: 'usr_student_01',
        studentName: 'Kavindu Bandara',
        startedAt: '2026-11-02T10:00:00Z',
        submittedAt: '2026-11-02T10:18:20Z',
        answers: { 'q-1': 1, 'q-2': 1, 'q-3': false, 'q-4': 1, 'q-5': false },
        score: 50,
        percentage: 100,
        isPassed: true,
        status: 'graded',
        teacherFeedback: 'Outstanding score! Flawless grasp of Python syntax and RDBMS fundamentals.'
      }
    ];
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('ict_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('ict_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('ict_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(() => {
    const saved = localStorage.getItem('ict_papers');
    return saved ? JSON.parse(saved) : INITIAL_PAPERS;
  });

  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(() => {
    const saved = localStorage.getItem('ict_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [achievements] = useState<StudentAchievement[]>(INITIAL_ACHIEVEMENTS);

  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile>(() => {
    const saved = localStorage.getItem('ict_instructor');
    return saved ? JSON.parse(saved) : INITIAL_INSTRUCTOR;
  });

  // Local persistence sync
  useEffect(() => {
    localStorage.setItem('ict_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ict_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('ict_progress', JSON.stringify(lessonProgress));
  }, [lessonProgress]);

  useEffect(() => {
    localStorage.setItem('ict_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('ict_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('ict_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('ict_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ict_papers', JSON.stringify(questionPapers));
  }, [questionPapers]);

  useEffect(() => {
    localStorage.setItem('ict_requests', JSON.stringify(registrationRequests));
  }, [registrationRequests]);

  useEffect(() => {
    localStorage.setItem('ict_exams', JSON.stringify(exams));
    localStorage.setItem('ict_questions', JSON.stringify(examQuestions));
    localStorage.setItem('ict_attempts', JSON.stringify(examAttempts));
  }, [exams, examQuestions, examAttempts]);

  useEffect(() => {
    localStorage.setItem('ict_instructor', JSON.stringify(instructorProfile));
  }, [instructorProfile]);

  // Action Implementations
  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const enrollInCourse = (studentId: string, grade: GradeLevel) => {
    const targetCourse = courses.find(c => c.grade === grade);
    if (!targetCourse) return;
    const exists = enrollments.find(e => e.studentId === studentId && e.courseId === targetCourse.id);
    if (exists) return;

    const newEnrollment: CourseEnrollment = {
      id: 'enr-' + Date.now(),
      studentId,
      courseId: targetCourse.id,
      grade,
      enrolledAt: new Date().toISOString(),
      status: 'active'
    };
    setEnrollments(prev => [...prev, newEnrollment]);
  };

  const markLessonComplete = (studentId: string, lessonId: string, completed: boolean) => {
    setLessonProgress(prev => {
      const idx = prev.findIndex(p => p.studentId === studentId && p.lessonId === lessonId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: 'prog-' + Date.now(),
            studentId,
            lessonId,
            completed,
            lastWatchedSeconds: 0,
            completedAt: completed ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString()
          }
        ];
      }
    });
  };

  const saveLessonProgress = (studentId: string, lessonId: string, seconds: number) => {
    setLessonProgress(prev => {
      const idx = prev.findIndex(p => p.studentId === studentId && p.lessonId === lessonId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], lastWatchedSeconds: seconds, updatedAt: new Date().toISOString() };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: 'prog-' + Date.now(),
            studentId,
            lessonId,
            completed: false,
            lastWatchedSeconds: seconds,
            updatedAt: new Date().toISOString()
          }
        ];
      }
    });
  };

  const submitExamAttempt = (attempt: Omit<ExamAttempt, 'id'>) => {
    const newAttempt: ExamAttempt = {
      ...attempt,
      id: 'att-' + Date.now()
    };
    setExamAttempts(prev => [...prev.filter(a => !(a.examId === attempt.examId && a.studentId === attempt.studentId)), newAttempt]);
  };

  const recordAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRec: AttendanceRecord = {
      ...record,
      id: 'att-' + Date.now()
    };
    setAttendanceRecords(prev => [
      ...prev.filter(r => !(r.studentId === record.studentId && r.date === record.date && r.classTitle === record.classTitle)),
      newRec
    ]);
  };

  const bulkRecordAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const formatted = records.map((r, i) => ({ ...r, id: 'att-b-' + Date.now() + '-' + i }));
    setAttendanceRecords(prev => [...prev, ...formatted]);
  };

  const addPayment = (paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>): PaymentRecord => {
    const receiptNumber = 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newPay: PaymentRecord = {
      ...paymentData,
      id: 'pay-' + Date.now(),
      receiptNumber
    };
    setPayments(prev => [newPay, ...prev]);

    // If marked paid, automatically activate enrollment!
    if (newPay.status === 'paid') {
      enrollInCourse(newPay.studentId, newPay.grade);
    }
    return newPay;
  };

  const updatePaymentStatus = (id: string, status: PaymentRecord['status'], notes?: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, status, notes: notes || p.notes };
        if (status === 'paid') {
          enrollInCourse(p.studentId, p.grade);
        }
        return updated;
      }
      return p;
    }));
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: 'ann-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addQuestionPaper = (paperData: Omit<QuestionPaper, 'id' | 'createdAt' | 'downloadCount'>) => {
    const newPaper: QuestionPaper = {
      ...paperData,
      id: 'paper-' + Date.now(),
      createdAt: new Date().toISOString(),
      downloadCount: 0
    };
    setQuestionPapers(prev => [newPaper, ...prev]);
  };

  const deleteQuestionPaper = (id: string) => {
    setQuestionPapers(prev => prev.filter(p => p.id !== id));
  };

  const incrementPaperDownload = (id: string) => {
    setQuestionPapers(prev => prev.map(p => p.id === id ? { ...p, downloadCount: p.downloadCount + 1 } : p));
  };

  const submitRegistrationRequest = (reqData: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newReq: RegistrationRequest = {
      ...reqData,
      id: 'req-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setRegistrationRequests(prev => [newReq, ...prev]);
  };

  const updateRegistrationStatus = (id: string, status: RegistrationRequest['status'], adminNotes?: string) => {
    setRegistrationRequests(prev => prev.map(r => r.id === id ? { ...r, status, adminNotes: adminNotes ?? r.adminNotes } : r));
  };

  const addExam = (examData: Omit<OnlineExam, 'id'>, questions: Omit<ExamQuestion, 'id' | 'examId'>[]) => {
    const examId = 'exam-' + Date.now();
    const newExam: OnlineExam = {
      ...examData,
      id: examId,
      questionsCount: questions.length
    };
    const createdQuestions: ExamQuestion[] = questions.map((q, idx) => ({
      ...q,
      id: 'q-' + examId + '-' + idx,
      examId
    }));

    setExams(prev => [newExam, ...prev]);
    setExamQuestions(prev => [...prev, ...createdQuestions]);
  };

  const updateInstructorProfile = (updates: Partial<InstructorProfile>) => {
    setInstructorProfile(prev => ({ ...prev, ...updates }));
  };

  const addLesson = (lessonData: Omit<Lesson, 'id' | 'resources'>) => {
    const newLes: Lesson = {
      ...lessonData,
      id: 'les-' + Date.now(),
      resources: [
        {
          id: 'res-' + Date.now(),
          lessonId: 'les-' + Date.now(),
          title: 'Lesson Notes (PDF)',
          fileType: 'pdf',
          fileUrl: '/assets/sample-notes.pdf',
          fileSizeMb: 1.5
        }
      ]
    };
    setLessons(prev => [...prev, newLes]);
    // update course lessonCount
    setCourses(prev => prev.map(c => c.grade === lessonData.grade ? { ...c, lessonCount: c.lessonCount + 1 } : c));
  };

  const deleteLesson = (id: string) => {
    const les = lessons.find(l => l.id === id);
    setLessons(prev => prev.filter(l => l.id !== id));
    if (les) {
      setCourses(prev => prev.map(c => c.grade === les.grade ? { ...c, lessonCount: Math.max(0, c.lessonCount - 1) } : c));
    }
  };

  return (
    <DataContext.Provider value={{
      courses,
      chapters,
      lessons,
      lessonProgress,
      liveClasses,
      enrollments,
      exams,
      examQuestions,
      examAttempts,
      attendanceRecords,
      payments,
      announcements,
      questionPapers,
      registrationRequests,
      achievements,
      instructorProfile,
      updateCourse,
      enrollInCourse,
      markLessonComplete,
      saveLessonProgress,
      submitExamAttempt,
      recordAttendance,
      bulkRecordAttendance,
      addPayment,
      updatePaymentStatus,
      addAnnouncement,
      deleteAnnouncement,
      addQuestionPaper,
      deleteQuestionPaper,
      incrementPaperDownload,
      submitRegistrationRequest,
      updateRegistrationStatus,
      addExam,
      updateInstructorProfile,
      addLesson,
      deleteLesson
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
