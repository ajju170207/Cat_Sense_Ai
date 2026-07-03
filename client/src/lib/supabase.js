import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here'

if (!isConfigured) {
  console.warn('Supabase is not configured. Authentication and storage features will be limited.')
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithPassword: async () => ({ error: { message: 'Authentication service is temporarily unavailable. Please try again later.' } }),
        signInWithOAuth: async () => ({ error: { message: 'Social login is temporarily unavailable. Please try again later.' } }),
        signUp: async () => ({ error: { message: 'Registration is temporarily unavailable. Please try again later.' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Database service is unavailable.' } }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'Storage service is unavailable.' } }),
          getPublicUrl: () => ({ data: { publicUrl: null } }),
        })
      }
    }
