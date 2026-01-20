"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        
        // Obtener el hash de la URL
        const hash = typeof window !== "undefined" ? window.location.hash : ""
        
        if (!hash) {
          setError("Link inválido o expirado")
          setTimeout(() => router.push("/auth/login"), 2000)
          return
        }

        // Parsear el hash para obtener los parámetros
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")
        const type = params.get("type")

        if (!accessToken) {
          setError("Link inválido o expirado")
          setTimeout(() => router.push("/auth/login"), 2000)
          return
        }

        // Si es un recovery token, guardar la sesión y redirigir a reset password
        if (type === "recovery") {
          // Establecer la sesión en Supabase
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          })

          if (sessionError) {
            setError(sessionError.message)
            setTimeout(() => router.push("/auth/login"), 2000)
            return
          }

          // Redirigir a la página de reset de contraseña
          router.push("/auth/reset-password")
        } else {
          setError("Tipo de link no reconocido")
          setTimeout(() => router.push("/auth/login"), 2000)
        }
      } catch (err: any) {
        console.error("Callback error:", err)
        setError(err.message || "Error procesando el enlace")
        setTimeout(() => router.push("/auth/login"), 2000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h1 className="text-xl font-semibold">
          {error ? "Error procesando el enlace" : "Procesando tu enlace de recuperación..."}
        </h1>
        {error && (
          <p className="text-red-600 max-w-sm">
            {error}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {!error && "Por favor espera mientras redirigimos tu sesión"}
        </p>
      </div>
    </div>
  )
}
