"use client"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Gift, Plus, CalendarDays, FileSpreadsheet, LogOut, BarChart3, Gauge, User } from "lucide-react"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
  user?: { full_name: string; email: string; role?: string } | null
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isOpen = true,
  onClose,
  isMobile = false,
  user = null
}: SidebarProps) {
  const router = useRouter()
  const userRole = user?.role || 'teacher'
  const isCoordinator = userRole === "coordinator" || userRole === "admin"

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const menuItems = isCoordinator ? [
    { id: "coordinador", label: "Panel del Coordinador", icon: Gauge },
    { id: "grupos", label: "Todos los Grupos", icon: Users },
    { id: "estadisticas", label: "Estadísticas Globales", icon: BarChart3 },
  ] : [
    { id: "grupos", label: "Mis Grupos", icon: Users },
    { id: "asistencia", label: "Asistencia", icon: Calendar },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "cumpleanos", label: "Cumpleaños", icon: Gift },
    { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
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
          className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 z-40 sm:hidden overflow-y-auto flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-2 flex-1">
            {!isCoordinator && (
              <Button
                onClick={() => handleItemClick("crear-grupo")}
                className="w-full justify-start text-left"
                variant={activeSection === "crear-grupo" ? "default" : "ghost"}
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Crear Grupo</span>
              </Button>
            )}

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

          {/* User info and logout at bottom */}
          <div className="border-t p-4 space-y-2">
            <div className="text-sm text-gray-600 text-center py-2">
              {user?.full_name || "Profesor"}
            </div>
            {isCoordinator && (
              <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
                Coordinador
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/teacher/profile"
              }}
              className="w-full text-xs justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full text-xs justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Desktop: Fixed sidebar
  return (
    <div className="hidden sm:flex sm:flex-col w-64 bg-gray-50 border-r sticky top-16 h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-2 overflow-y-auto flex-1">
        {!isCoordinator && (
          <Button
            onClick={() => onSectionChange("crear-grupo")}
            className="w-full justify-start"
            variant={activeSection === "crear-grupo" ? "default" : "ghost"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Grupo
          </Button>
        )}

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

      {/* User info and logout at bottom */}
      <div className="border-t p-4 space-y-2">
        <div className="text-sm text-gray-600 text-center py-2">
          {user?.full_name || "Profesor"}
        </div>
        {isCoordinator && (
          <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
            Coordinador
          </div>
        )}
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full text-xs justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Salir
        </Button>
      </div>
    </div>
  )
}
