"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import DashboardClient from "@/components/dashboard/dashboard-client"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // Obtener la sesión
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Error obteniendo sesión:", sessionError)
          router.push("/auth/login")
          return
        }

        if (!session?.user?.id) {
          router.push("/auth/login")
          return
        }

        try {
          // Intentar cargar datos del profesor
          const { data: teacherData, error: teacherError } = await supabase
            .from("teachers")
            .select("id, email, full_name, role")
            .eq("id", session.user.id)
            .single()

          if (teacherError && teacherError.code !== "PGRST116") {
            throw teacherError
          }

          if (teacherData) {
            setUser({
              ...teacherData,
              role: teacherData.role || 'teacher'
            })
          } else {
            // Usuario sin datos en teachers - crear temporal
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || "Profesor",
              role: 'teacher'
            })
          }
        } catch (err) {
          console.error("Error cargar profesor:", err)
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || "Profesor",
            role: 'teacher'
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error general:", error)
        if (attempts < 1) {
          setAttempts(attempts + 1)
          setTimeout(() => {
            checkAuth()
          }, 500)
        } else {
          router.push("/auth/login")
        }
      }
    }
    checkAuth()
  }, [router, attempts])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Cargando...</div>
          <div className="text-sm text-gray-500">Verificando sesión</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">No autenticado</div>
          <div className="text-sm text-gray-500">Redirigiendo al login...</div>
        </div>
      </div>
    )
  }

  return <DashboardClient user={user} />
}
