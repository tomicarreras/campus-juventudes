"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { signOut, getCurrentUser, type AuthUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface NavbarProps {
  onMenuToggle?: (open: boolean) => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen
    setMobileMenuOpen(newState)
    onMenuToggle?.(newState)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo del Sistema" className="h-10" />
            <span className="font-bold text-lg hidden sm:inline"></span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline truncate max-w-[200px]">
              {user?.full_name || "Profesor"}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="hidden sm:flex text-xs sm:text-base"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Salir</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="sm:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 border-t space-y-2">
            <div className="px-2 py-2 text-sm text-gray-600 text-center">
              {user?.full_name || "Profesor"}
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full text-xs"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
