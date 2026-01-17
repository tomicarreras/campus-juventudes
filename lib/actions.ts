"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const getSupabase = async () => {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  
  if (!url || !key) {
    throw new Error("Supabase URL or Key not configured")
  }
  
  // Crear instancia con storage de cookies - IMPORTANTE: una nueva instancia por request
  const supabase = createSupabaseClient(url, key, {
    auth: {
      storage: {
        getItem: (key: string) => {
          const cookie = cookieStore.get(key)
          console.log(`📦 Getting cookie ${key}:`, !!cookie?.value)
          return cookie?.value || null
        },
        setItem: (key: string, value: string) => {
          console.log(`📦 Setting cookie ${key}`)
          try {
            cookieStore.set(key, value, { 
              path: "/", 
              maxAge: 60 * 60 * 24 * 365,
              httpOnly: false
            })
          } catch (e) {
            console.error("Failed to set cookie:", e)
          }
        },
        removeItem: (key: string) => {
          console.log(`📦 Removing cookie ${key}`)
          try {
            cookieStore.delete(key)
          } catch (e) {
            console.error("Failed to delete cookie:", e)
          }
        },
      } as any,
    },
  })
  
  return supabase
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Faltan datos del formulario" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  if (!email || !password || !fullName) {
    return { error: "Email, contraseña y nombre completo son obligatorios" }
  }

  try {
    const supabase = await getSupabase()
    
    console.log("📝 Creating account for:", email)
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (authError) {
      console.error("❌ SignUp error:", authError.message)
      return { error: authError.message }
    }

    if (authData.user) {
      const { error: teacherError } = await supabase.from("teachers").insert([
        {
          id: authData.user.id,
          email: email.toString(),
          full_name: fullName.toString(),
        },
      ])

      if (teacherError) {
        console.error("Error creating teacher record:", teacherError)
        return { error: "Error al crear el perfil de profesor" }
      }
    }

    return { success: "Cuenta creada exitosamente. Ya podés iniciar sesión." }
  } catch (error) {
    console.error("SignUp exception:", error)
    return { error: "Error inesperado. Intentá de nuevo." }
  }
}

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Faltan datos del formulario" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios" }
  }

  try {
    const supabase = await getSupabase()
    
    console.log("🔐 Attempting login for:", email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      console.error("❌ Login error:", error.message)
      return { error: error.message }
    }

    console.log("✅ Login successful for:", email)

    return { success: true }
  } catch (error) {
    console.error("❌ Login exception:", error)
    return { error: "Error inesperado. Intentá de nuevo." }
  }
}

export async function signOut() {
  try {
    const supabase = await getSupabase()
    console.log("🔓 Signing out")
    await supabase.auth.signOut()
  } catch (error) {
    console.error("SignOut error:", error)
  }
}
