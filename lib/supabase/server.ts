import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export const createClient = () => {
  if (!isSupabaseConfigured) {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )
  }

  const cookieStore = cookies()
  
  // Construir el string de cookies
  let cookieHeader = ""
  try {
    const allCookies = cookieStore.getAll?.() || []
    cookieHeader = allCookies.map(({ name, value }) => `${name}=${value}`).join("; ")
  } catch (e) {
    console.error("Error getting cookies:", e)
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          ...(cookieHeader && { cookie: cookieHeader }),
        },
      },
    }
  )
}
