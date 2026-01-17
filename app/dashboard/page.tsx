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
        
        // Intentar obtener la sesión primero
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setUser(session.user)
          setLoading(false)
          return
        }
        
        // Si no hay sesión, intentar obtener el usuario
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          setLoading(false)
        } else {
          // Reintentar una vez después de un pequeño delay
          if (attempts < 1) {
            setAttempts(attempts + 1)
            setTimeout(() => {
              checkAuth()
            }, 500)
          } else {
            router.push("/auth/login")
          }
        }
      } catch (error) {
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
