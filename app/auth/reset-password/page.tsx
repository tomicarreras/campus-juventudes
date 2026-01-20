"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // Verificar que el usuario vino por un link de recuperación válido
    const checkValidSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError("Link de recuperación inválido o expirado. Por favor, solicita uno nuevo.")
        setTimeout(() => router.push("/auth/login"), 3000)
      } else {
        setVerified(true)
      }
    }

    checkValidSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) throw updateError

      setMessage("¡Contraseña actualizada! Redireccionando al login...")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            Verificando link...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Lock className="h-6 w-6" />
            Restablecer contraseña
          </CardTitle>
          <CardDescription>Ingresá tu nueva contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded text-sm">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Nueva contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium">
                Confirmar contraseña
              </label>
              <Input
                id="confirm"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
