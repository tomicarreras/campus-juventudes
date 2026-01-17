"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        router.push("/auth/login")
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
    </div>
  )
}
