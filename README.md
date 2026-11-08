# ICT Hemantha LMS — Hemantha Wanninayake B.Sc ICT Academy

A complete, modern, professional, fully responsive Learning Management System (LMS) built for **Hemantha Wanninayake B.Sc - ICT Academy**, serving Grade 6 to Grade 11 students across Sri Lanka.

## 🚀 Key Features

### 1. Academy Branding & Multilingual Architecture
- **Colors**: Primary Navy (`#0B1F4A`), Secondary Blue (`#2563A6`), Primary Orange (`#F58220`), Light Blue (`#EAF3FC`), Background (`#F5F7FA`).
- **Language Switcher**: Instant switching between English and Sinhala (සිංහල) with Unicode-compatible typography (`Noto Sans Sinhala` & `Plus Jakarta Sans`).
- **Direct Official Contacts**: WhatsApp (`0772735518` / `https://wa.me/94772735518`) and Google Maps location integration.

### 2. Grade 6–11 Dedicated Curriculum Pages
- **Grade 6**: Fundamentals of ICT (Basic computers, safety, typing, simple applications).
- **Grade 7**: Digital Tools & Documents (Word, Excel, presentations, internet safety).
- **Grade 8**: Internet & Communication (Email, research, online safety, collaboration).
- **Grade 9**: ICT Fundamentals & Programming Basics (Scratch, logic, flowcharts).
- **Grade 10**: Data & Multimedia (Number systems, computer architecture, HTML/CSS).
- **Grade 11**: G.C.E. O/L Exam Preparation (Python algorithms, RDBMS & SQL, past papers).

### 3. Student Learning & Assessment Experience
- **Interactive Video Lesson Player**: HD video lectures, chapter navigation, progress tracking, and lecture notes.
- **Online Examination Platform**: Timed tests, automated MCQ and True/False grading, countdown timer with auto-submit, instant scoring and feedback.
- **Attendance Records**: Session-by-session attendance tracking with percentage metrics.
- **PayHere Online Payments & Bank Deposits**: Sri Lankan gateway integration with automated enrollment activation and printable receipts.
- **Downloadable Past Papers**: National O/L papers, model papers, and term tests.

### 4. Admin Management Console (`/admin`)
- **Grade-wise Announcements**: Send targeted broadcasts to individual grades or all students.
- **Question Paper Management**: Upload and manage PDF papers by grade and year.
- **Admissions & Registration Requests**: Review public enrollment requests, approve, and convert to student accounts.
- **Individual Student Progress**: Search students, view lesson completion percentages and exam attempts.
- **Manual Cash Payments**: Issue verified receipts for cash given directly to the instructor.
- **Class Attendance Register**: Mark present, absent, or late attendance with bulk actions.
- **Instructor Profile & Photo Manager**: Update bio, degrees, and qualifications.

---

## 🗄️ Supabase PostgreSQL Setup

The complete database schema is provided in `/supabase/schema.sql`.

### Tables Included:
1. `profiles`
2. `courses`
3. `chapters`
4. `lessons`
5. `lesson_resources`
6. `course_enrollments`
7. `lesson_progress`
8. `live_classes`
9. `attendance`
10. `exams`
11. `exam_questions`
12. `exam_attempts`
13. `payments`
14. `announcements`
15. `question_papers`
16. `registration_requests`
17. `student_achievements`
18. `instructor_profiles`

### Environment Variables:
Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
VITE_PAYHERE_MERCHANT_ID="1234567"
VITE_PAYHERE_MODE="sandbox"
```

The application runs seamlessly in standalone mode with complete reactive state management and local persistence, as well as with live Supabase credentials.

---

## 💻 Tech Stack
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Database / Auth**: Supabase PostgreSQL + Auth architecture
