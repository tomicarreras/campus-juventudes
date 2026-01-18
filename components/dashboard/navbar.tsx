"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { getCurrentUser, type AuthUser } from "@/lib/auth"

interface NavbarProps {
  onMenuToggle?: (open: boolean) => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
    }
    loadUser()
  }, [])

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
      </div>
    </nav>
  )
}
