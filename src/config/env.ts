/**
 * ProjectMatch Centralized Client Environment Configuration
 * Validates and exposes frontend environment variables cleanly
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const env = {
  supabaseUrl,
  supabaseKey,
  isConfigured: isSupabaseConfigured,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
} as const;

// Developer feedback if environment variables are missing
if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.error(
    '[ProjectMatch] Missing Environment Configuration:\n' +
    'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) are required.\n' +
    'Please check your .env file or Vercel project environment variables.'
  );
}
