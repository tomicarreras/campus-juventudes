"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Gift, Plus, CalendarDays, FileSpreadsheet, Menu } from "lucide-react"

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

  const handleSectionChange = (id: string) => {
    onSectionChange(id)
    setOpen(false) // cierra menú desplegable móvil
  }

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <div className="md:hidden flex justify-between items-center bg-[var(--sidebar)] border-b border-[var(--sidebar-border)] p-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center p-2 text-[var(--sidebar-foreground)]"
        >
          <Menu className="w-6 h-6 mr-1" />
          Menú
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {open && (
        <div className="md:hidden absolute top-12 left-0 w-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-b border-[var(--sidebar-border)] z-20 flex flex-col p-2 space-y-2">
          <Button
            onClick={() => handleSectionChange("crear-grupo")}
            variant={activeSection === "crear-grupo" ? "default" : "ghost"}
            className="justify-start w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Grupo
          </Button>
          {menuItems.map(item => (
            <Button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="justify-start w-full"
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col w-64 p-4 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] space-y-2">
        <Button
          onClick={() => handleSectionChange("crear-grupo")}
          className="w-full justify-start"
          variant={activeSection === "crear-grupo" ? "default" : "ghost"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Grupo
        </Button>
        {menuItems.map(item => (
          <Button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            variant={activeSection === item.id ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>
    </>
  )
}
