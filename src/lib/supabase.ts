import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRegistrationPayload } from '../types';

/**
 * Retrieves the active Supabase URL and Anon Key.
 * Checks environment variables first, then localStorage for live testing in preview.
 */
export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    ''
  ).trim();

  const envKey = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    ''
  ).trim();

  let storageUrl = '';
  let storageKey = '';
  if (typeof window !== 'undefined') {
    storageUrl = (localStorage.getItem('ict_supabase_url') || '').trim();
    storageKey = (localStorage.getItem('ict_supabase_anon_key') || '').trim();
  }

  const url = storageUrl || envUrl;
  const anonKey = storageKey || envKey;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url !== 'https://your-project.supabase.co' &&
    anonKey !== 'your-anon-key' &&
    !url.includes('placeholder') &&
    url.startsWith('https://')
  );

  return { url, anonKey, isConfigured };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('ict_supabase_url', url.trim());
    else localStorage.removeItem('ict_supabase_url');

    if (anonKey) localStorage.setItem('ict_supabase_anon_key', anonKey.trim());
    else localStorage.removeItem('ict_supabase_anon_key');
  }
  // Reinitialize client
  initSupabaseClient();
}

export let isSupabaseConfigured = false;
export let supabase: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  isSupabaseConfigured = isConfigured;

  if (isConfigured && url && anonKey) {
    try {
      supabase = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabase;
    } catch (error) {
      console.warn('Failed to initialize Supabase client:', error);
      supabase = null;
      return null;
    }
  }

  supabase = null;
  return null;
}

// Initial initialization
initSupabaseClient();

export function setCustomSupabaseClient(client: SupabaseClient | null): void {
  supabase = client;
  isSupabaseConfigured = Boolean(client);
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabase) {
    return initSupabaseClient();
  }
  return supabase;
}

/**
 * Inserts a student registration request into the Supabase public.registration_requests table.
 * 
 * Required fields saved:
 * 1. student_name
 * 2. parent_name
 * 3. mobile
 * 4. parent_mobile
 * 5. email
 * 6. school_name
 * 7. current_grade
 * 8. requested_grade
 * 9. preferred_batch
 * 10. additional_notes
 * 11. status ('pending')
 * 12. created_at (ISO timestamp)
 */
export async function insertRegistrationRequest(
  payload: SupabaseRegistrationPayload
): Promise<{ 
  success: boolean; 
  data?: any; 
  error?: string; 
  errorCode?: string;
  isConfigured: boolean;
}> {
  const client = getSupabaseClient();
  const isConfigured = Boolean(client);

  if (!isConfigured || !client) {
    return {
      success: false,
      isConfigured: false,
      error: 'Supabase credentials are not configured. Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or through the Supabase Connection panel.',
      errorCode: 'NOT_CONFIGURED',
    };
  }

  const primaryRecord = {
    student_name: payload.student_name,
    parent_name: payload.parent_name || null,
    mobile: payload.mobile,
    parent_mobile: payload.parent_mobile || null,
    email: payload.email,
    school_name: payload.school_name || null,
    current_grade: String(payload.current_grade),
    requested_grade: Number(payload.requested_grade) || payload.requested_grade,
    preferred_batch: payload.preferred_batch,
    additional_notes: payload.additional_notes || null,
    status: payload.status || 'pending',
    created_at: payload.created_at || new Date().toISOString(),
  };

  try {
    // Perform standard insert into public.registration_requests
    const response = await client
      .from('registration_requests')
      .insert([primaryRecord]);

    if (!response.error) {
      return { 
        success: true, 
        data: response.data || [primaryRecord], 
        isConfigured: true 
      };
    }

    const { error } = response;
    const errMsg = (error.message || '').toLowerCase();
    const errDetails = error.details ? ` (${error.details})` : '';
    const errHint = error.hint ? ` Hint: ${error.hint}` : '';

    // If RLS blocked the submission
    if (error.code === '42501' || errMsg.includes('row-level security') || errMsg.includes('permission denied')) {
      return {
        success: false,
        error: `Supabase Row-Level Security blocked submission [Error 42501]: ${error.message}. Please enable the INSERT policy for anon users: CREATE POLICY "Allow public registration insert" ON public.registration_requests FOR INSERT TO anon, authenticated WITH CHECK (true);`,
        errorCode: error.code || '42501',
        isConfigured: true,
      };
    }

    // Check if error is due to a column mismatch in an existing database
    const isColumnError = 
      error.code === '42703' || 
      error.code === 'PGRST204' || 
      (errMsg.includes('column') && (errMsg.includes('does not exist') || errMsg.includes('not found') || errMsg.includes('schema cache')));

    if (isColumnError) {
      // Adaptive fallback matching the live Supabase schema columns
      // (student_name, parent_name, mobile, parent_mobile, email, school_name, grade, requested_grade, status, created_at)
      const adaptiveRecord: Record<string, any> = {
        student_name: payload.student_name,
        parent_name: payload.parent_name || null,
        mobile: payload.mobile,
        parent_mobile: payload.parent_mobile || null,
        email: payload.email,
        school_name: payload.school_name || null,
        grade: payload.current_grade,
        requested_grade: payload.requested_grade,
        status: payload.status || 'pending',
        created_at: payload.created_at || new Date().toISOString(),
      };

      const adaptiveRes = await client
        .from('registration_requests')
        .insert([adaptiveRecord]);

      if (!adaptiveRes.error) {
        return { 
          success: true, 
          data: adaptiveRes.data || [adaptiveRecord], 
          isConfigured: true 
        };
      }

      // If user had legacy column names (student_full_name, student_mobile, preferred_class, additional_message)
      const legacyRecord = {
        student_full_name: payload.student_name,
        parent_name: payload.parent_name || null,
        student_mobile: payload.mobile,
        parent_mobile: payload.parent_mobile || null,
        email: payload.email,
        school_name: payload.school_name || null,
        current_grade: payload.current_grade,
        requested_grade: payload.requested_grade,
        preferred_class: payload.preferred_batch,
        additional_message: payload.additional_notes || null,
        status: payload.status || 'pending',
      };

      const fallbackRes = await client
        .from('registration_requests')
        .insert([legacyRecord]);

      if (!fallbackRes.error) {
        return { success: true, data: fallbackRes.data || [legacyRecord], isConfigured: true };
      }

      return {
        success: false,
        error: `Supabase Schema Column Error [${error.code || 'PGRST204'}]: ${error.message}.${errDetails}${errHint} Run the SQL migration in Supabase SQL editor to add the missing columns (current_grade, preferred_batch, additional_notes).`,
        errorCode: error.code,
        isConfigured: true,
      };
    }

    // Generic Supabase error
    return {
      success: false,
      error: `Supabase Error [${error.code || 'UNKNOWN'}]: ${error.message}.${errDetails}${errHint}`,
      errorCode: error.code,
      isConfigured: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected network error occurred while communicating with Supabase.',
      errorCode: 'NETWORK_ERROR',
      isConfigured: true,
    };
  }
}
