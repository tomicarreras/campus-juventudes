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

    // Traer el rol del usuario desde la BD
    const { data: userData, error: userError } = await supabase
      .from("teachers")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userError || userData?.role !== "admin") {
      return { error: "No tienes permisos" }
    }

    // Si es admin, traer todos los datos (el server bypass RLS automáticamente)
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
    return { error: error.message }
  }
}
