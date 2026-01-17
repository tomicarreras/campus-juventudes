"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const getSupabase = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
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
    const supabase = getSupabase()
    
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
    const supabase = getSupabase()
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Error inesperado. Intentá de nuevo." }
  }
}

export async function signOut() {
  try {
    const supabase = getSupabase()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Sign out error:", error)
  }
}
