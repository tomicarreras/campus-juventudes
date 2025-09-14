"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { id: "grupos", label: "Mis Grupos", icon: Users },
    { id: "asistencia", label: "Asistencia", icon: Calendar },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "cumpleanos", label: "Cumpleaños", icon: Gift },
    { id: "exportar", label: "Exportar Planillas", icon: FileSpreadsheet },
  ]

  const handleNavigate = (id: string) => {
    onSectionChange(id)
    setOpen(false)
  }

  const mobileUi = (
    <>
      {/* Botón FIXED centrado */}
      <div className="fixed left-0 right-0 z-50" style={{ top: "4rem" }}>
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

      {open && (
        <>
          {/* overlay */}
          <div
            className="fixed left-0 right-0 bottom-0 z-40"
            style={{ top: "4rem", backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <div role="dialog" aria-modal="true" className="fixed left-0 right-0 z-50" style={{ top: "4rem" }}>
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
                  onClick={() => { handleNavigate("crear-grupo") }}
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
        </>
      )}
    </>
  )

  return (
    <>
      {/* Desktop: igual que antes */}
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

      {/* Mobile: render en portal para evitar problemas con ancestros */}
      {mounted ? createPortal(mobileUi, document.body) : null}
    </>
  )
}
