"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Gift, Plus, CalendarDays, FileSpreadsheet } from "lucide-react"

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
      {/* Botón hamburguesa móvil */}
      <div className="md:hidden flex items-center p-2 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-b border-[var(--sidebar-border)]">
        <button onClick={() => setOpen(!open)} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-2 font-semibold">Menú</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 p-4 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)]
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:h-auto
        `}
      >
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

      {/* Fondo semitransparente al abrir menú en móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  )
}
