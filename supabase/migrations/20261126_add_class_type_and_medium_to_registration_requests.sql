-- Non-destructive migration: add class_type and medium columns to public.registration_requests
-- Preserves all existing columns (including parent_mobile), student records, and RLS policies.

ALTER TABLE public.registration_requests
  ADD COLUMN IF NOT EXISTS class_type TEXT;

ALTER TABLE public.registration_requests
  ADD COLUMN IF NOT EXISTS medium TEXT;

ALTER TABLE public.registration_requests
  ADD COLUMN IF NOT EXISTS preferred_batch TEXT;

NOTIFY pgrst, 'reload schema';
