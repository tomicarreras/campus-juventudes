"use server"

import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  try {
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

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  try {
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
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  await supabase.auth.signOut()
}
