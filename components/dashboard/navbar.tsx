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
      } catch {
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
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* --- DESKTOP / TABLET: exactamente tu layout original --- */}
        <div className="hidden md:flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo del Sistema" className="h-10" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hola, {user?.full_name || "Profesor"}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        {/* --- MOBILE: logo + saludo en una línea, botón Salir en fila separada alineado a la derecha --- */}
        <div className="md:hidden flex flex-col py-3">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo del Sistema" className="h-10" />
            <span className="ml-3 text-sm text-gray-600">Hola, {user?.full_name || "Profesor"}</span>
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
