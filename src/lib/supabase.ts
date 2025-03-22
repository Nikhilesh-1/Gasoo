
import { createClient } from '@supabase/supabase-js'

// Either use environment variables or fallback to these default values
// Replace these with your actual Supabase URL and anon key after setting up your project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log connection status for debugging
console.log('Supabase client initialized with URL:', supabaseUrl)

// Gas readings table type
export type GasReadingRow = {
  id: number
  level: number
  created_at: string
}
