"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, User, Settings } from "lucide-react"
import { signOut, type AuthUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  user?: AuthUser | null
  onMenuToggle?: (open: boolean) => void
  mobileMenuOpen?: boolean
}

export default function Navbar({ user = null, onMenuToggle, mobileMenuOpen = false }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex text-xs sm:text-base"
                >
                  <Settings className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Opciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/teacher/profile" className="cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Salir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
