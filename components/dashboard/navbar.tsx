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
    <nav className="bg-white shadow-sm border-b w-full">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo + nombre */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-sm font-medium text-gray-700">
            Hola, {user?.full_name || "Profesor"}
          </span>
        </div>

        {/* Botón salir */}
        <div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </nav>
  )
}
