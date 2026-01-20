"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import TeacherProfile from "@/components/teacher/teacher-profile"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container max-w-3xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header con botón de volver */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="hover:bg-primary/10"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-4xl font-bold">Mi Perfil</h1>
            </div>
            <p className="text-muted-foreground ml-12">Gestiona tu cuenta y seguridad</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <TeacherProfile />
          
          {/* Botón de volver al dashboard - Mobile friendly */}
          <div className="flex gap-3 pt-4">
            <Button 
              asChild 
              className="flex-1 h-11 text-base"
              variant="outline"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
