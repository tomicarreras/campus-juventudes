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

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { id: "grupos", label: "Mis Grupos", icon: Users },
    { id: "asistencia", label: "Asistencia", icon: Calendar },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "cumpleanos", label: "Cumpleaños", icon: Gift },
    { id: "exportar", label: "Exportar Planillas", icon: FileSpreadsheet },
  ]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
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
      {/* ------------------ DESKTOP (sin cambios) ------------------ */}
      <div className="hidden md:block w-64 bg-gray-50 border-r min-h-screen p-4">
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
      </div>

      {/* ------------------ MOBILE (botón FIXED arriba, centrado) ------------------ */}
      <div className="md:hidden">
        {/* Barra FIXED en top, full width. El inner container centra el botón */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="w-full flex justify-center">
              <button
                onClick={() => setOpen(true)}
                aria-label="Abrir menú"
                className="max-w-xs w-full flex items-center justify-center gap-2 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
                style={{ maxWidth: 240 }}
              >
                <Menu className="h-5 w-5" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spacer para que el contenido debajo no quede tapado por la barra fixed */}
        <div className="h-14" />

        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 transition-opacity ${
            open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        />

        {/* Drawer desde arriba (full width) */}
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed top-0 left-0 right-0 z-50 transform transition-transform ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="bg-white border-b shadow-md">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-medium">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <X className="h-5 w-5" />
              </button>
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
      </div>
    </>
  )
}
