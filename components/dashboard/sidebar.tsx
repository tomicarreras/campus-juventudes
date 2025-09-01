"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Gift, Plus, CalendarDays, FileSpreadsheet } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "grupos", label: "Mis Grupos", icon: Users },
    { id: "asistencia", label: "Asistencia", icon: Calendar },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "cumpleanos", label: "Cumpleaños", icon: Gift },
    { id: "exportar", label: "Exportar Planillas", icon: FileSpreadsheet },
  ]

  const handleSectionChange = (id: string) => {
    onSectionChange(id)
  }

  return (
    <>
      {/* Topbar móvil */}
      <div className="md:hidden flex overflow-x-auto bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-b border-[var(--sidebar-border)] p-2 space-x-2">
        <Button
          onClick={() => handleSectionChange("crear-grupo")}
          variant={activeSection === "crear-grupo" ? "default" : "ghost"}
        >
          <Plus className="h-4 w-4 mr-1" />
          Crear
        </Button>

        {menuItems.map(item => (
          <Button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            variant={activeSection === item.id ? "default" : "ghost"}
          >
            <item.icon className="h-4 w-4 mr-1" />
            {item.label}
          </Button>
        ))}
      </div>

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
