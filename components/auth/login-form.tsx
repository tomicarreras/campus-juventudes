"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { signIn } from "@/lib/actions"
import { resetPassword } from "@/lib/auth"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

function ForgotPasswordDialog() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error)
      } else {
        setMessage("Se envió un email de recuperación. Revisá tu bandeja de entrada.")
        setEmail("")
        setTimeout(() => setOpen(false), 3000)
      }
    } catch (err) {
      setError("Error al enviar el email de recuperación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-primary hover:underline">
          ¿Olvidaste tu contraseña?
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recuperar contraseña
          </DialogTitle>
          <DialogDescription>
            Te enviaremos un enlace para que puedas restablecer tu contraseña
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReset} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-3 py-2 rounded text-sm">
              {message}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="reset-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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
      const formData = new FormData(formRef.current!)
      
      const result = await signIn(null, formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result.success) {
        // Guardar la sesión en localStorage para que el cliente la encuentre
        if (result.session) {
          const sessionData = {
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
            user: result.session.user,
            expires_at: Date.now() + (60 * 60 * 24 * 365 * 1000), // 1 año
          }
          
          // Guardar en localStorage con la clave que Supabase espera
          localStorage.setItem(
            `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0].split("//")[1]}-auth-token`,
            JSON.stringify(sessionData)
          )
        }
        
        // Pequeño delay para asegurar que localStorage se escribió
        setTimeout(() => {
          router.push("/dashboard")
        }, 300)
      }
    } catch (err) {
      console.error("Form submit error:", err)
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

          <div className="flex justify-end">
            <ForgotPasswordDialog />
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
