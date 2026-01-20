"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, User, Mail, CheckCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

export default function TeacherProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChanging, setIsChanging] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: teacherData } = await supabase
          .from("teachers")
          .select("*")
          .eq("id", authUser.id)
          .single()

        setUser({
          ...authUser,
          full_name: teacherData?.full_name,
        })
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsChanging(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setPasswordChanged(true)
      setMessage("¡Contraseña actualizada exitosamente!")
      setNewPassword("")
      setConfirmPassword("")
      
      setTimeout(() => {
        setOpen(false)
        setPasswordChanged(false)
      }, 2500)
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña")
    } finally {
      setIsChanging(false)
    }
  }

  const handleCancel = () => {
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    setMessage("")
    setPasswordChanged(false)
    setOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <Card className="shadow-md border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                Información Personal
              </CardTitle>
              <CardDescription className="mt-2">Detalles de tu cuenta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <User className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-semibold text-base">{user?.full_name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-semibold text-base break-all">{user?.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            Seguridad
          </CardTitle>
          <CardDescription className="mt-2">Gestiona la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Actualiza tu contraseña regularmente para mantener tu cuenta segura. Usa una contraseña fuerte con números, letras mayúsculas y caracteres especiales.
            </p>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-11 text-base flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cambiar contraseña
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    Cambiar contraseña
                  </DialogTitle>
                  <DialogDescription>
                    Crea una nueva contraseña segura para tu cuenta. Mínimo 6 caracteres.
                  </DialogDescription>
                </DialogHeader>

                {passwordChanged ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-green-700">¡Contraseña actualizada!</h3>
                      <p className="text-sm text-muted-foreground">Tu contraseña ha sido cambiada exitosamente</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                        <div className="text-red-500 mt-0.5 flex-shrink-0">⚠</div>
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="new-pass" className="text-sm font-semibold">
                        Nueva contraseña
                      </label>
                      <Input
                        id="new-pass"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isChanging}
                        required
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Usa números, mayúsculas y caracteres especiales para más seguridad
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirm-pass" className="text-sm font-semibold">
                        Confirmar contraseña
                      </label>
                      <Input
                        id="confirm-pass"
                        type="password"
                        placeholder="Confirma tu nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isChanging}
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isChanging} 
                        className="flex-1 h-10"
                      >
                        {isChanging ? (
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
                        disabled={isChanging}
                        onClick={handleCancel}
                        className="h-10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
