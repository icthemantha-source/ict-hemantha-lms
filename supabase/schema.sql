-- ==============================================================================
-- ICT HEMANTHA LMS - POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Hemantha Wanninayake B.Sc - ICT Academy (Grades 6–11)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('paid', 'pending', 'partial', 'outstanding', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status_type AS ENUM ('present', 'absent', 'late');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE registration_status_type AS ENUM ('pending', 'approved', 'rejected', 'enrolled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role_type DEFAULT 'student'::user_role_type,
    student_id TEXT UNIQUE,
    phone TEXT,
    school_name TEXT,
    grade INT CHECK (grade >= 6 AND grade <= 11),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade INT NOT NULL UNIQUE CHECK (grade >= 6 AND grade <= 11),
    title TEXT NOT NULL,
    title_si TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    description_si TEXT NOT NULL,
    instructor_name TEXT DEFAULT 'Hemantha Wanninayake B.Sc',
    instructor_title TEXT DEFAULT 'Senior ICT Lecturer & Educator',
    lesson_count INT DEFAULT 12,
    duration_hours INT DEFAULT 48,
    monthly_fee_lkr NUMERIC(10, 2) DEFAULT 2500.00,
    cover_image TEXT,
    syllabus_overview TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_si TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    grade INT NOT NULL CHECK (grade >= 6 AND grade <= 11),
    title TEXT NOT NULL,
    title_si TEXT,
    description TEXT,
    video_url TEXT NOT NULL,
    duration_minutes INT DEFAULT 45,
    order_index INT DEFAULT 1,
    is_free_preview BOOLEAN DEFAULT false,
    notes_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LESSON RESOURCES (PDFs, Notes)
CREATE TABLE IF NOT EXISTS public.lesson_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(6, 2) DEFAULT 2.5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COURSE ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    grade INT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'cancelled')),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    UNIQUE(student_id, course_id)
);

-- 9. LESSON PROGRESS TRACKING
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    last_watched_seconds INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- 10. LIVE CLASSES
CREATE TABLE IF NOT EXISTS public.live_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade INT NOT NULL CHECK (grade >= 6 AND grade <= 11),
    title TEXT NOT NULL,
    title_si TEXT,
    instructor_name TEXT DEFAULT 'Hemantha Wanninayake B.Sc',
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 90,
    meeting_link TEXT NOT NULL,
    platform TEXT DEFAULT 'Zoom',
    recording_url TEXT,
    is_completed BOOLEAN DEFAULT false,
    topics JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    grade INT NOT NULL CHECK (grade >= 6 AND grade <= 11),
    class_title TEXT NOT NULL,
    date DATE NOT NULL,
    status attendance_status_type DEFAULT 'present'::attendance_status_type,
    remarks TEXT,
    marked_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date, class_title)
);

-- 12. EXAMS
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade INT NOT NULL CHECK (grade >= 6 AND grade <= 11),
    title TEXT NOT NULL,
    title_si TEXT,
    description TEXT,
    duration_minutes INT DEFAULT 60,
    total_marks INT DEFAULT 100,
    pass_percentage INT DEFAULT 40,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_published BOOLEAN DEFAULT false,
    academic_year TEXT DEFAULT '2026',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EXAM QUESTIONS
CREATE TABLE IF NOT EXISTS public.exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'mcq' CHECK (type IN ('mcq', 'true_false', 'structured')),
    question_text TEXT NOT NULL,
    question_text_si TEXT,
    options JSONB,
    options_si JSONB,
    correct_option_index INT,
    correct_boolean BOOLEAN,
    model_answer TEXT,
    marks INT DEFAULT 5,
    explanation TEXT,
    order_index INT DEFAULT 1
);

-- 14. EXAM ATTEMPTS & RESULTS
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    answers JSONB DEFAULT '{}'::jsonb,
    score NUMERIC(5, 2) DEFAULT 0,
    percentage NUMERIC(5, 2) DEFAULT 0,
    is_passed BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    teacher_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- 15. PAYMENTS & CASH MANAGEMENT
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    grade INT NOT NULL,
    course_title TEXT NOT NULL,
    amount_lkr NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'payhere_online')),
    reference_number TEXT,
    receipt_number TEXT UNIQUE NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status payment_status_type DEFAULT 'paid'::payment_status_type,
    notes TEXT,
    verified_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. GRADE ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_si TEXT,
    content TEXT NOT NULL,
    content_si TEXT,
    target_grade TEXT NOT NULL DEFAULT 'all', -- '6', '7', '8', '9', '10', '11' or 'all'
    author_name TEXT NOT NULL,
    is_important BOOLEAN DEFAULT false,
    attachment_name TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. QUESTION PAPERS
CREATE TABLE IF NOT EXISTS public.question_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade INT NOT NULL CHECK (grade >= 6 AND grade <= 11),
    title TEXT NOT NULL,
    title_si TEXT,
    paper_type TEXT NOT NULL CHECK (paper_type IN ('Past Paper', 'Model Paper', 'Term Test', 'Revision Paper')),
    academic_year TEXT NOT NULL,
    term TEXT,
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(6, 2) DEFAULT 1.5,
    download_count INT DEFAULT 0,
    is_restricted_to_enrolled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. GRADE REGISTRATION REQUESTS
CREATE TABLE IF NOT EXISTS public.registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    parent_name TEXT,
    mobile TEXT NOT NULL,
    parent_mobile TEXT,
    email TEXT NOT NULL,
    school_name TEXT,
    current_grade INT NOT NULL,
    requested_grade INT NOT NULL,
    preferred_batch TEXT NOT NULL,
    additional_notes TEXT,
    status registration_status_type DEFAULT 'pending'::registration_status_type,
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- NON-DESTRUCTIVE SQL MIGRATION (FOR EXISTING SUPABASE TABLES)
-- If your registration_requests table already exists in Supabase, run this:
-- ==============================================================================
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS parent_mobile TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS school_name TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS current_grade INT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS requested_grade INT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS preferred_batch TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS additional_notes TEXT;
ALTER TABLE public.registration_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- If your existing table had student_full_name, backfill student_name if null:
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registration_requests' AND column_name = 'student_full_name') THEN
        UPDATE public.registration_requests SET student_name = student_full_name WHERE student_name IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registration_requests' AND column_name = 'student_mobile') THEN
        UPDATE public.registration_requests SET mobile = student_mobile WHERE mobile IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registration_requests' AND column_name = 'preferred_class') THEN
        UPDATE public.registration_requests SET preferred_batch = preferred_class WHERE preferred_batch IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registration_requests' AND column_name = 'additional_message') THEN
        UPDATE public.registration_requests SET additional_notes = additional_message WHERE additional_notes IS NULL;
    END IF;
END $$;

-- 19. STUDENT ACHIEVEMENTS & TESTIMONIALS GALLERY
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    photo_url TEXT,
    academic_year TEXT NOT NULL,
    grade INT NOT NULL,
    exam_type TEXT NOT NULL,
    result_grade TEXT NOT NULL,
    achievement_text TEXT NOT NULL,
    testimonial_text TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. INSTRUCTOR PROFILE
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Hemantha Wanninayake B.Sc',
    title TEXT NOT NULL DEFAULT 'Senior ICT Lecturer & Head of ICT Academy',
    degrees TEXT NOT NULL DEFAULT 'B.Sc (Hons) in Information Technology',
    photo_url TEXT,
    bio_en TEXT NOT NULL,
    bio_si TEXT NOT NULL,
    qualifications JSONB DEFAULT '[]'::jsonb,
    experience_years INT DEFAULT 14,
    specialization JSONB DEFAULT '[]'::jsonb,
    phone TEXT DEFAULT '0772735518',
    location_url TEXT DEFAULT 'https://maps.app.goo.gl/QdtHZKfNFxx9B57LA?g_st=aw',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read for general display, update only own or admin
CREATE POLICY "Public profiles can be viewed" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses, Chapters, Lessons: Public viewable, Admin/Teacher editable
CREATE POLICY "Courses are viewable by all" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by enrolled students or admins" ON public.lessons FOR SELECT USING (
    is_free_preview = true OR
    EXISTS (
        SELECT 1 FROM public.course_enrollments
        WHERE course_enrollments.student_id = auth.uid()
        AND course_enrollments.grade = lessons.grade
        AND course_enrollments.status = 'active'
    ) OR
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
);

-- Enrollments: View own enrollments, admin can manage all
CREATE POLICY "Students can view own enrollments" ON public.course_enrollments FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Lesson Progress: Only student can view/update own progress
CREATE POLICY "Students manage own progress" ON public.lesson_progress FOR ALL USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Exams & Attempts: Students can view exams for their grade, attempts are private
CREATE POLICY "Students view grade exams" ON public.exams FOR SELECT USING (is_published = true);
CREATE POLICY "Students manage own attempts" ON public.exam_attempts FOR ALL USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Attendance & Payments: Student views own records, admin manages all
CREATE POLICY "Students view own attendance" ON public.attendance FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Students view own payments" ON public.payments FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Announcements & Question Papers: Public or grade filtered
CREATE POLICY "View announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "View question papers" ON public.question_papers FOR SELECT USING (true);
CREATE POLICY "Public achievements" ON public.student_achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public instructor profile" ON public.instructor_profiles FOR SELECT USING (true);

-- Registration Requests: Anyone (anon or authenticated) can submit a registration request
CREATE POLICY "Allow public registration insert" ON public.registration_requests 
    FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- Registration Requests: Only admins can view and manage registration requests
CREATE POLICY "Admins can view registration requests" ON public.registration_requests 
    FOR SELECT 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update registration requests" ON public.registration_requests 
    FOR UPDATE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
