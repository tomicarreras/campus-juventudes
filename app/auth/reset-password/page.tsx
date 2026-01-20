"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)
  const [passwordUpdated, setPasswordUpdated] = useState(false)

  useEffect(() => {
    // Verificar que el usuario vino por un link de recuperación válido
    const checkValidSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError("Link de recuperación inválido o expirado. Por favor, solicita uno nuevo.")
        setVerifying(false)
        setTimeout(() => router.push("/auth/login"), 4000)
      } else {
        setVerified(true)
        setVerifying(false)
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

      setPasswordUpdated(true)
      setMessage("¡Contraseña actualizada exitosamente!")
      setNewPassword("")
      setConfirmPassword("")
      
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  // Establecer alias para compatibilidad
  const setNewPassword = setPassword

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-center">Verificando tu enlace...</h2>
            <p className="text-sm text-muted-foreground text-center">
              Por favor espera mientras verificamos tu sesión
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-lg border-red-200">
          <CardContent className="pt-8 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-red-600">Enlace Inválido</h2>
              <p className="text-sm text-muted-foreground">
                {error}
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-lg border-green-200">
          <CardContent className="pt-8 space-y-4 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-600">¡Éxito!</h2>
            <p className="text-sm text-muted-foreground">
              Tu contraseña ha sido actualizada correctamente.
            </p>
            <p className="text-xs text-muted-foreground">
              Redireccionando al login en unos segundos...
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/auth/login">
                Ir al Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Restablecer contraseña</CardTitle>
          <CardDescription>
            Crea una nueva contraseña segura para tu cuenta
          </CardDescription>
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
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Usa una contraseña fuerte con números y caracteres especiales
              </p>
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
                className="h-10"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar contraseña"
                )}
              </Button>

              <Button 
                type="button"
                variant="outline"
                disabled={isLoading}
                asChild
                className="w-full h-10"
              >
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al login
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
