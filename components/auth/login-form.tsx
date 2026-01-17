"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/actions"
import { createClient } from "@/lib/supabase/client"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Iniciando sesión...
        </>
      ) : (
        "Iniciar sesión"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [debugMessage, setDebugMessage] = useState("")

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success && !isRedirecting) {
      setIsRedirecting(true)
      setDebugMessage("✅ Login exitoso, verificando sesión...")
      
      // Pequeño delay para permitir que la sesión se persista
      const timer = setTimeout(async () => {
        try {
          // Verificar que la sesión exista antes de redirigir
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            setDebugMessage("✅ Sesión confirmada, redirigiendo...")
            console.log("🔄 Session confirmed, redirecting to dashboard")
            router.push("/dashboard")
          } else {
            setDebugMessage("⚠️ Sesión no encontrada, reintentando...")
            console.log("⚠️ Session not found after login")
            // Reintentar después de otro delay
            setTimeout(() => router.push("/dashboard"), 1000)
          }
        } catch (err) {
          console.error("Error checking session:", err)
          // Aun así intentar redirigir
          router.push("/dashboard")
        }
      }, 800)
      
      return () => clearTimeout(timer)
    }
  }, [state, router, isRedirecting])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <LogIn className="h-6 w-6" />
          Iniciar sesión
        </CardTitle>
        <CardDescription>Ingresá a tu cuenta para gestionar la asistencia</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
              {state.error}
            </div>
          )}

          {debugMessage && (
            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-700 px-4 py-3 rounded text-sm">
              {debugMessage}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="tu@email.com" 
              autoComplete="email" 
              required 
              disabled={isRedirecting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
              disabled={isRedirecting}
            />
          </div>

          <SubmitButton />

          <div className="text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/registro" className="text-primary hover:underline">
              Registrate
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
