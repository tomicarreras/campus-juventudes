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

if (!isSupabaseConfigured) {
  throw new Error("Missing Supabase environment variables")
}

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export const createClient = () => supabase
