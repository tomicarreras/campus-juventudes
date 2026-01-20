"use server"

import { createClient } from "./supabase/server"

export const getAdminDashboardData = async () => {
  const supabase = createClient()

  try {
    // Verificar que el usuario es admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "No autenticado" }
    }

    console.log("Admin check - User ID:", user.id, "User email:", user.email)

    // Traer el rol del usuario desde la BD
    const { data: userData, error: userError } = await supabase
      .from("teachers")
      .select("id, email, role")
      .eq("id", user.id)
      .single()

    console.log("Admin check - User data:", userData, "Error:", userError)

    if (userError) {
      return { error: `No se encontró el usuario: ${userError.message}` }
    }

    if (!userData || userData.role !== "admin") {
      return { error: `No tienes permisos. Tu rol es: ${userData?.role || 'desconocido'}` }
    }

    console.log("Admin verified, fetching all data...")

    // Si es admin, traer todos los datos
    const { data: teachers, error: teachersError } = await supabase
      .from("teachers")
      .select("*")
      .neq("role", "admin")
      .order("full_name")

    const { data: groups, error: groupsError } = await supabase
      .from("groups")
      .select("*")
      .order("name")

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .order("full_name")

    const { data: attendance, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")

    console.log("Fetched - Teachers:", teachers?.length || 0, "Groups:", groups?.length || 0, "Students:", students?.length || 0, "Attendance:", attendance?.length || 0)

    if (teachersError || groupsError || studentsError || attendanceError) {
      return { 
        error: "Error cargando datos",
        details: { teachersError, groupsError, studentsError, attendanceError }
      }
    }

    return {
      teachers: teachers || [],
      groups: groups || [],
      students: students || [],
      attendance: attendance || [],
    }
  } catch (error: any) {
    console.error("Server action error:", error)
    return { error: error.message }
  }
}
