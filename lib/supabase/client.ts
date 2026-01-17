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

// Proxy handler for dummy client methods
const dummyHandler = {
  get: () => new Proxy({}, dummyHandler),
  apply: () => Promise.resolve({ data: null, error: null }),
}

// Create a singleton instance of the Supabase client for Client Components
let supabaseInstance: any = null

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: (key: string) => {
            if (typeof localStorage !== "undefined") {
              return localStorage.getItem(key)
            }
            return null
          },
          setItem: (key: string, value: string) => {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(key, value)
            }
          },
          removeItem: (key: string) => {
            if (typeof localStorage !== "undefined") {
              localStorage.removeItem(key)
            }
          },
        } as any,
      },
    })
  } catch (e) {
    console.error("Failed to create Supabase client:", e)
    supabaseInstance = new Proxy({}, dummyHandler)
  }
} else {
  // Create a comprehensive dummy client that won't error on method calls
  supabaseInstance = new Proxy(
    {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({ single: () => Promise.resolve({ data: null, error: null }), order: () => Promise.resolve({ data: null, error: null }) }),
        order: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    dummyHandler
  )
}

export const supabase = supabaseInstance

export const createClient = () => {
  return supabaseInstance
}
