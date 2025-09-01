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
    const loadUser = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Contenedor flex, columna en móvil, fila en desktop */}
        <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0">
          <div className="flex items-center mb-2 md:mb-0">
            <img src="/logo.png" alt="Logo del Sistema" className="h-10 w-auto" />
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <span className="text-sm text-gray-600 text-center md:text-left">
              Hola, {user?.full_name || "Profesor"}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="flex justify-center">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
