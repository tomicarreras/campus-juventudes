"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, User, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function TeacherProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChanging, setIsChanging] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

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

      setMessage("¡Contraseña actualizada exitosamente!")
      setNewPassword("")
      setConfirmPassword("")
      
      setTimeout(() => {
        setOpen(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña")
    } finally {
      setIsChanging(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mi Perfil
          </CardTitle>
          <CardDescription>Información de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nombre</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user?.full_name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user?.email}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Cambiar contraseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Cambiar contraseña
                  </DialogTitle>
                  <DialogDescription>
                    Ingresá tu nueva contraseña. Debe tener al menos 6 caracteres.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleChangePassword} className="space-y-4">
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
                    <label htmlFor="new-pass" className="text-sm font-medium">
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
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-pass" className="text-sm font-medium">
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
                    />
                  </div>

                  <Button type="submit" disabled={isChanging} className="w-full">
                    {isChanging ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar contraseña"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
