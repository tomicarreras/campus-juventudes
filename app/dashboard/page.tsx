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
        console.log("🔍 Checking auth in dashboard")
        const supabase = createClient()
        
        // Intentar obtener la sesión primero
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log("📋 Session check:", { hasSession: !!session, error: sessionError?.message })
        
        if (session) {
          console.log("✅ Found session, setting user")
          setUser(session.user)
          setLoading(false)
          return
        }
        
        // Si no hay sesión, intentar obtener el usuario
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log("👤 User check:", { hasUser: !!user, error: userError?.message })
        
        if (user) {
          console.log("✅ Found user, setting user")
          setUser(user)
          setLoading(false)
        } else {
          console.log("❌ No user found, redirecting to login")
          // Reintentar una vez después de un pequeño delay
          if (attempts < 2) {
            console.log("🔄 Retrying auth check...")
            setAttempts(attempts + 1)
            setTimeout(() => {
              checkAuth()
            }, 500)
          } else {
            router.push("/auth/login")
          }
        }
      } catch (error) {
        console.error("❌ Auth check error:", error)
        if (attempts < 2) {
          console.log("🔄 Retrying after error...")
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
