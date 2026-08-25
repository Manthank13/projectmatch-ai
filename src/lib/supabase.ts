import { createClient } from '@supabase/supabase-js';

// Supabase Environment Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'placeholder-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)
);

// Create single persistent Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

export interface DatabaseProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  department: string | null;
  campus: string | null;
  avatar_url: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  resume_url?: string | null;
  bio?: string | null;
  role?: string | null;
  skills?: any;
  availability_hours?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch profile record by Supabase Auth User ID
 */
export async function getProfile(userId: string): Promise<DatabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Could not fetch Supabase profile from postgres table:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase getProfile exception:', err);
    return null;
  }
}

/**
 * Upsert profile record in Supabase Postgres
 */
export async function upsertProfile(profile: Partial<DatabaseProfile> & { id: string }): Promise<DatabaseProfile | null> {
  try {
    const payload = {
      ...profile,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Could not upsert Supabase profile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase upsertProfile exception:', err);
    return null;
  }
}

/**
 * Upload profile avatar image to Supabase Storage bucket 'avatars'
 * with fallback to Base64 Data URL if storage bucket is not configured.
 */
export async function uploadAvatarImage(userId: string, file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.warn('Supabase storage upload fallback:', uploadError.message);
      // Fallback: Read file to local data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    // Fallback: Read file as Base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
