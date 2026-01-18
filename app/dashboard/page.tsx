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
        
        // Obtener la sesión primero
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Error obteniendo sesión:", sessionError)
          throw sessionError
        }

        if (!session?.user?.id) {
          // Sin sesión válida, redirigir a login
          router.push("/auth/login")
          return
        }

        // Intentar cargar datos completos del profesor
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("id, email, full_name")
          .eq("id", session.user.id)
          .single()

        if (teacherError) {
          console.error("Error obteniendo datos del profesor:", teacherError)
          // Si no hay datos en teachers, crear uno temporal con los datos de auth
          const tempUser = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || "Profesor",
            role: 'teacher'
          }
          setUser(tempUser)
          setLoading(false)
          return
        }

        const userWithRole = {
          ...teacherData,
          role: teacherData?.role || 'teacher'
        }
        setUser(userWithRole)
        setLoading(false)
      } catch (error) {
        console.error("Error en checkAuth:", error)
        if (attempts < 1) {
          // Reintentar una sola vez con un delay
          setAttempts(attempts + 1)
          setTimeout(() => {
            checkAuth()
          }, 500)
        } else {
          // Después de reintentar, redirigir a login
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
