"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  Gift,
  Plus,
  CalendarDays,
  FileSpreadsheet,
  Menu,
  X,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

/**
 * Sidebar responsive:
 * - md+ -> sidebar vertical a la izquierda (igual que antes)
 * - <md -> topbar con logo + hamburguesa. Al abrir, aparece un panel con las opciones (se cierra al seleccionar).
 */
export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { id: "grupos", label: "Mis Grupos", icon: Users },
    { id: "asistencia", label: "Asistencia", icon: Calendar },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "cumpleanos", label: "Cumpleaños", icon: Gift },
    { id: "exportar", label: "Exportar Planillas", icon: FileSpreadsheet },
  ]

  // Cerrar con Esc y bloquear scroll cuando el drawer esté abierto
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleNavigate = (id: string) => {
    onSectionChange(id)
    setOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-gray-50 border-r min-h-screen p-4">
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
          <h2 className="ml-3 text-lg font-semibold">WorkBot</h2>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => onSectionChange("crear-grupo")}
            className="w-full justify-start"
            variant={activeSection === "crear-grupo" ? "default" : "ghost"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Grupo
          </Button>

          {menuItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
              <span className="text-sm font-medium">WorkBot</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(true)}
                aria-label="Abrir menú"
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile drawer / dropdown */}
        {/* Fondo overlay */}
        <div
          aria-hidden={!open}
          className={`fixed inset-0 z-40 transition-opacity ${open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        />

        <div
          role="dialog"
          aria-modal="true"
          className={`fixed top-0 left-0 right-0 z-50 transform transition-transform ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="bg-white border-b shadow-md">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
                <span className="font-semibold">Menu</span>
              </div>
              <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Cerrar menú">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-4 pb-6 space-y-2">
              <Button
                onClick={() => handleNavigate("crear-grupo")}
                className="w-full justify-start"
                variant={activeSection === "crear-grupo" ? "default" : "ghost"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Grupo
              </Button>

              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
