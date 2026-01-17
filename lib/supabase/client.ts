"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof supabaseUrl === "string" &&
  supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.length > 0

// Create a singleton instance of the Supabase client for Client Components
let supabaseInstance: any = null

if (isSupabaseConfigured) {
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a dummy/proxy client that won't crash
  supabaseInstance = {
    auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }) },
    from: () => ({ select: () => Promise.resolve({ data: null, error: null }) }),
  }
}

export const supabase = supabaseInstance

export const createClient = () => supabase
