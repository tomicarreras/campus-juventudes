"use client"

import { useState } from "react"
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

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 bg-gray-50 border-r min-h-screen p-4">
        <div className="space-y-2 w-full">
          <Button
            onClick={() => onSectionChange("crear-grupo")}
            className="w-full justify-start"
            variant={activeSection === "crear-grupo" ? "default" : "ghost"}
          >
            <Plus className="h-4 w-4 mr-2" /> Crear Grupo
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

      {/* Mobile menu button (debajo del navbar, centrado) */}
      <div className="md:hidden w-full border-b bg-white flex justify-center">
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

      {/* Mobile sidebar (desplegable) */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menú</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Button
              onClick={() => {
                onSectionChange("crear-grupo")
                setOpen(false)
              }}
              className="w-full justify-start"
              variant={activeSection === "crear-grupo" ? "default" : "ghost"}
            >
              <Plus className="h-4 w-4 mr-2" /> Crear Grupo
            </Button>

            {menuItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id)
                  setOpen(false)
                }}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
