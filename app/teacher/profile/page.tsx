"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import TeacherProfile from "@/components/teacher/teacher-profile"
import { Loader2 } from "lucide-react"

export default function TeacherProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/auth/login")
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu cuenta y seguridad</p>
        </div>
        
        <TeacherProfile />
      </div>
    </div>
  )
}
