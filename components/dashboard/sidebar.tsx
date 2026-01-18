"use client"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Gift, Plus, CalendarDays, FileSpreadsheet } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isOpen = true,
  onClose,
  isMobile = false
}: SidebarProps) {
  const menuItems = [
    { id: "grupos", label: "Mis Grupos", icon: Users },
    { id: "asistencia", label: "Asistencia", icon: Calendar },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "cumpleanos", label: "Cumpleaños", icon: Gift },
    { id: "exportar", label: "Exportar Planillas", icon: FileSpreadsheet },
  ]

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId)
    if (isMobile && onClose) {
      onClose()
    }
  }

  // Mobile: Show as overlay
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={onClose}
          />
        )}
        <div 
          className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 z-40 sm:hidden overflow-y-auto ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-2">
            <Button
              onClick={() => handleItemClick("crear-grupo")}
              className="w-full justify-start text-left"
              variant={activeSection === "crear-grupo" ? "default" : "ghost"}
            >
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Crear Grupo</span>
            </Button>

            {menuItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start text-left"
              >
                <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Desktop: Fixed sidebar
  return (
    <div className="hidden sm:flex sm:flex-col w-64 bg-gray-50 border-r sticky top-16 h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-2 overflow-y-auto flex-1">
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
  )
}
