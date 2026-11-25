-- Migration: Add missing `medium` column to public.registration_requests
-- Verified existing columns: student_name, parent_name, mobile, parent_mobile,
-- email, school_name, current_grade, requested_grade, preferred_batch, additional_notes.

ALTER TABLE public.registration_requests
  ADD COLUMN IF NOT EXISTS medium TEXT;

ALTER TABLE public.registration_requests
  ADD COLUMN IF NOT EXISTS preferred_batch TEXT;

NOTIFY pgrst, 'reload schema';
