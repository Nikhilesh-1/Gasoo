
import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsdmrbhvrbokebggmynx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZG1yYmh2cmJva2ViZ2dteW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjAwMjAsImV4cCI6MjA1ODE5NjAyMH0.0vjVQR8GXmeIyaHVQR1gezuabDfXzyP_6d1gdGFPINw'

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
