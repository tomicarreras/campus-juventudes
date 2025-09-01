"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut, getCurrentUser, type AuthUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const loadUser = async () => {
      try {
        const { user } = await getCurrentUser()
        if (mounted) setUser(user)
      } catch (e) {
        // opcional: manejar error
        if (mounted) setUser(null)
      }
    }
    loadUser()
    return () => {
      mounted = false
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container: en mobile columna, en md+ fila */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-16 py-3 md:py-0">
          {/* Izquierda: logo + saludo (siempre en la misma linea) */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Logo del Sistema"
              className="h-10 w-auto object-contain"
            />
            <span className="text-sm text-gray-600 hidden sm:inline">
              Hola, {user?.full_name || "Profesor"}
            </span>
          </div>

          {/* Derecha / area mobile: en mobile el boton baja */}
          <div className="mt-3 md:mt-0 md:ml-4 flex items-center justify-end">
            {/* En pantallas pequeñas mostramos el saludo compacto (si ocultamos por width) */}
            <span className="text-sm text-gray-600 sm:hidden mr-3">
              Hola, {user?.full_name || "Profesor"}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
