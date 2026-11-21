import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRegistrationPayload } from '../types';

export const CANONICAL_SUPABASE_URL = 'https://tpehwhydacaicalhayft.supabase.co';

/**
 * Normalizes a Supabase URL by stripping quotes, whitespace, trailing slashes,
 * and accidental REST/Auth/Storage subpaths (e.g. /rest/v1) so createClient()
 * never constructs duplicate paths that trigger PGRST125.
 */
export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';

  // Remove whitespace and accidental surrounding quotes
  let cleaned = rawUrl.trim().replace(/^["']+|["']+$/g, '').trim();
  if (!cleaned) return '';

  // Strip known Supabase API path suffixes and anything following them
  cleaned = cleaned.replace(/\/(rest|auth|storage|functions|realtime)\/v1(\/.*)?$/i, '');
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');

  // If valid URL, ensure exact origin (protocol + host + optional port) with no path
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.origin;
    }
  } catch {
    // Fall back to regex-cleaned string if URL constructor rejects partial strings
  }

  return cleaned;
}

/**
 * Checks whether a URL is a placeholder or malformed/outdated project URL.
 */
function isValidProjectUrl(normalizedUrl: string): boolean {
  if (!normalizedUrl) return false;
  if (
    normalizedUrl === 'https://your-project.supabase.co' ||
    normalizedUrl.includes('placeholder') ||
    !normalizedUrl.startsWith('https://')
  ) {
    return false;
  }
  return true;
}

/**
 * Retrieves the active Supabase URL and Publishable/Anon Key.
 * Inspects environment variables and localStorage, cleans outdated or malformed
 * localStorage URLs, and ensures the exact normalized base URL is used.
 */
export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const rawEnvUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    ''
  ).trim();

  const envKey = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    ''
  ).trim().replace(/^["']+|["']+$/g, '');

  const normalizedEnvUrl = normalizeSupabaseUrl(rawEnvUrl);

  let rawStorageUrl = '';
  let storageKey = '';
  if (typeof window !== 'undefined') {
    rawStorageUrl = (localStorage.getItem('ict_supabase_url') || '').trim();
    storageKey = (localStorage.getItem('ict_supabase_anon_key') || '').trim().replace(/^["']+|["']+$/g, '');
  }

  let normalizedStorageUrl = normalizeSupabaseUrl(rawStorageUrl);

  // Inspect localStorage for outdated, incorrect, or malformed URLs
  if (typeof window !== 'undefined' && rawStorageUrl) {
    const isOutdatedOrWrong =
      !isValidProjectUrl(normalizedStorageUrl) ||
      normalizedStorageUrl !== CANONICAL_SUPABASE_URL;

    if (isOutdatedOrWrong) {
      console.warn('[Supabase] Outdated or incorrect localStorage URL detected and cleared:', {
        foundInLocalStorage: rawStorageUrl,
        expectedBaseUrl: CANONICAL_SUPABASE_URL,
      });
      localStorage.removeItem('ict_supabase_url');
      normalizedStorageUrl = '';
    } else if (rawStorageUrl !== normalizedStorageUrl) {
      // Rewrite normalized canonical URL back to localStorage (e.g. stripped /rest/v1 or trailing slash)
      console.info('[Supabase] Normalized localStorage URL:', {
        previousUrl: rawStorageUrl,
        normalizedUrl: normalizedStorageUrl,
      });
      localStorage.setItem('ict_supabase_url', normalizedStorageUrl);
    }
  }

  // Clean placeholder key from localStorage if present
  if (typeof window !== 'undefined' && storageKey === 'your-anon-key') {
    localStorage.removeItem('ict_supabase_anon_key');
    storageKey = '';
  }

  // Ensure exact canonical base URL is used when valid env/storage matches, falling back to canonical base URL
  const candidateUrl = normalizedStorageUrl || normalizedEnvUrl || CANONICAL_SUPABASE_URL;
  const url =
    isValidProjectUrl(candidateUrl) && candidateUrl === CANONICAL_SUPABASE_URL
      ? CANONICAL_SUPABASE_URL
      : isValidProjectUrl(candidateUrl)
        ? candidateUrl
        : CANONICAL_SUPABASE_URL;

  const anonKey =
    storageKey && storageKey !== 'your-anon-key'
      ? storageKey
      : envKey;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    anonKey !== 'your-anon-key' &&
    isValidProjectUrl(url)
  );

  return { url, anonKey, isConfigured };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  const normalizedUrl = normalizeSupabaseUrl(url);
  const cleanedKey = (anonKey || '').trim().replace(/^["']+|["']+$/g, '');

  if (typeof window !== 'undefined') {
    if (normalizedUrl && isValidProjectUrl(normalizedUrl)) {
      localStorage.setItem('ict_supabase_url', normalizedUrl);
    } else {
      localStorage.removeItem('ict_supabase_url');
    }

    if (cleanedKey && cleanedKey !== 'your-anon-key') {
      localStorage.setItem('ict_supabase_anon_key', cleanedKey);
    } else {
      localStorage.removeItem('ict_supabase_anon_key');
    }
  }

  console.info('[Supabase] Saved normalized configuration URL:', {
    url: normalizedUrl || CANONICAL_SUPABASE_URL,
  });

  // Reinitialize client
  initSupabaseClient();
}

export let isSupabaseConfigured = false;
export let supabase: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  isSupabaseConfigured = isConfigured;

  // Safe diagnostic logging: logs base URL only, NEVER logs API keys
  console.info('[Supabase] Client initialization status:', {
    supabaseUrl: url,
    isConfigured,
  });

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
      console.warn('[Supabase] Failed to initialize client for URL:', url, error);
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
  const { url } = getSupabaseCredentials();

  if (!isConfigured || !client) {
    return {
      success: false,
      isConfigured: false,
      error: 'Supabase credentials are not configured. Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or through the Supabase Connection panel.',
      errorCode: 'NOT_CONFIGURED',
    };
  }

  // Safe diagnostic logging (URL + table only, never logs API keys)
  console.info('[Supabase] Submitting registration_requests insert:', {
    supabaseUrl: url,
    table: 'registration_requests',
  });

  const primaryRecord = {
    student_name: payload.student_name,
    parent_name: payload.parent_name || null,
    mobile: payload.mobile,
    parent_mobile: payload.parent_mobile || null,
    email: payload.email || null,
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

    // Diagnostic log for failed request URL (without keys)
    console.warn('[Supabase] Insert failed for URL:', url, {
      code: error.code,
      message: error.message,
    });

    if (error.code === 'PGRST125') {
      return {
        success: false,
        error: `Supabase Invalid Path Error [PGRST125] for URL "${url}": ${error.message}. Ensure the base URL is "${CANONICAL_SUPABASE_URL}" without "/rest/v1" or trailing slashes.`,
        errorCode: 'PGRST125',
        isConfigured: true,
      };
    }

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
        email: payload.email || null,
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
        email: payload.email || null,
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
