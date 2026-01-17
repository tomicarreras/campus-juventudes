"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const getSupabase = async () => {
  const cookieStore = await cookies()
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        storage: {
          getItem: (key: string) => {
            const cookie = cookieStore.get(key)
            return cookie?.value || null
          },
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set(key, value, { path: "/", maxAge: 60 * 60 * 24 * 365 })
            } catch (e) {
              // Cookie setting failed - ignore
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.delete(key)
            } catch (e) {
              // Cookie deletion failed - ignore
            }
          },
        } as any,
      },
    }
  )
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
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (authError) {
      return { error: authError.message }
    }

    // Si el usuario se creó exitosamente, crear registro en tabla teachers
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
    console.error("Sign up error:", error)
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

    console.log("✅ Login successful, session data:", {
      user: data.user?.id,
      hasSession: !!data.session,
      accessToken: !!data.session?.access_token
    })

    // Asegurar que la sesión se persista en cookies del servidor
    if (data.session) {
      const cookieStore = await cookies()
      try {
        // Guardar el token de acceso
        cookieStore.set("sb-access-token", data.session.access_token, { 
          path: "/", 
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: false, // Cliente necesita leer esto
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax"
        })
        
        // Guardar el refresh token si existe
        if (data.session.refresh_token) {
          cookieStore.set("sb-refresh-token", data.session.refresh_token, { 
            path: "/", 
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
          })
        }
        
        console.log("✅ Tokens saved to cookies")
      } catch (e) {
        console.error("⚠️ Failed to set cookies:", e)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Login exception:", error)
    return { error: "Error inesperado. Intentá de nuevo." }
  }
}

export async function signOut() {
  try {
    const supabase = await getSupabase()
    await supabase.auth.signOut()
    
    const cookieStore = await cookies()
    try {
      cookieStore.delete("sb-auth-token")
    } catch (e) {
      // Cookie deletion failed - ignore
    }
  } catch (error) {
    console.error("Sign out error:", error)
  }
}
