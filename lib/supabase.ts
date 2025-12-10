import { createClient } from '@supabase/supabase-js';

// If the environment variables are missing (like during a build), use a fake placeholder.
// This prevents the "Build Failed" error.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey);