"use server"

import { createClient } from "./supabase/server"

export const getAdminDashboardData = async () => {
  try {
    const supabase = createClient()

    // TEST 1: Intentar obtener la sesión
    console.log("[Server] Intentando obtener sesión...")
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log("[Server] Session result:", session ? "FOUND" : "NOT FOUND", "Error:", sessionError?.message)

    if (!session) {
      console.log("[Server] No session found, attempting getUser...")
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log("[Server] User result:", user ? "FOUND" : "NOT FOUND", "Error:", userError?.message)
      
      if (!user) {
        return { error: "No hay sesión de usuario autenticada" }
      }
    }

    const userId = session?.user?.id || (await supabase.auth.getUser()).data.user?.id
    console.log("[Server] Using user ID:", userId)

    // TEST 2: Obtener el usuario de la tabla teachers
    const { data: userData, error: userError } = await supabase
      .from("teachers")
      .select("id, email, role")
      .eq("id", userId)
      .single()

    console.log("[Server] Teacher record:", userData, "Error:", userError?.message)

    if (!userData || userData.role !== "admin") {
      return { error: `Permiso denegado. Tu rol es: ${userData?.role || 'desconocido'}` }
    }

    console.log("[Server] Admin verificado, trayendo datos...")

    // TEST 3: Traer todos los datos
    const [{ data: teachers }, { data: groups }, { data: students }, { data: attendance }] = await Promise.all([
      supabase.from("teachers").select("*").neq("role", "admin"),
      supabase.from("groups").select("*"),
      supabase.from("students").select("*"),
      supabase.from("attendance").select("*"),
    ])

    console.log("[Server] Data fetched - Teachers:", teachers?.length || 0, "Groups:", groups?.length || 0)

    return {
      teachers: teachers || [],
      groups: groups || [],
      students: students || [],
      attendance: attendance || [],
    }
  } catch (error: any) {
    console.error("[Server] Error:", error.message)
    return { error: error.message }
  }
}
