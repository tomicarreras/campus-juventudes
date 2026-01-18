"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LandingPage } from "@/components/landing/landing-page"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push("/dashboard")
        } else {
          setHasSession(false)
          setIsLoading(false)
        }
      } catch (error) {
        setHasSession(false)
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mb-4 mx-auto"></div>
          <h1 className="text-xl font-bold text-white">Cargando...</h1>
        </div>
      </div>
    )
  }

  return <LandingPage />
}
