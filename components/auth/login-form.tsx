"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { signIn } from "@/lib/actions"

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
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("📝 Submitting login form")
      const formData = new FormData(formRef.current!)
      const email = formData.get("email")
      console.log("🔐 Attempting login for:", email)
      
      const result = await signIn(null, formData)
      console.log("📦 Server action result:", result)

      if (result.error) {
        console.error("❌ Login error:", result.error)
        setError(result.error)
        setIsLoading(false)
      } else if (result.success) {
        console.log("✅ Login success, redirecting...")
        // Redirigir inmediatamente
        setTimeout(() => {
          console.log("🚀 Pushing to /dashboard")
          router.push("/dashboard")
        }, 300)
      }
    } catch (err) {
      console.error("💥 Form submit error:", err)
      setError("Error inesperado")
      setIsLoading(false)
    }
  }

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
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
              {error}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>

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
