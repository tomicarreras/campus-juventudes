"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/dashboard/navbar"
import Sidebar from "@/components/dashboard/sidebar"
import CrearGrupoForm from "@/components/groups/crear-grupo-form"
import ListaGrupos from "@/components/groups/lista-grupos"
import GestionarEstudiantes from "@/components/groups/gestionar-estudiantes"
import SeleccionarGrupo from "@/components/attendance/seleccionar-grupo"
import TomarAsistencia from "@/components/attendance/tomar-asistencia"
import HistorialAsistencia from "@/components/attendance/historial-asistencia"
import CalendarioAsistencia from "@/components/calendar/calendario-asistencia"
import DetalleDia from "@/components/calendar/detalle-dia"
import SeccionCumpleanos from "@/components/birthdays/seccion-cumpleanos"
import ExportarPlanilla from "@/components/export/exportar-planilla"
import EstadisticasAsistencia from "@/components/statistics/estadisticas-asistencia"
import CoordinadorDashboard from "@/components/dashboard/coordinador-dashboard"
import type { Group } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface DashboardClientProps {
  user: any
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const userRole = user?.role || 'teacher'
  const [activeSection, setActiveSection] = useState(
    userRole === "coordinator" || userRole === "admin" ? "coordinador" : "grupos"
  )
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("groups").select("*").order("name")
      if (!error && data) setGroups(data)
      setLoadingGroups(false)
    }
    fetchGroups()
  }, [refreshTrigger])

  const handleGroupCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
    setActiveSection("grupos")
  }

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group)
    setActiveSection("gestionar-estudiantes")
  }

  const handleSelectGroupForAttendance = (group: Group) => {
    setSelectedGroup(group)
    setActiveSection("tomar-asistencia")
  }

  const handleBackToGroups = () => {
    setSelectedGroup(null)
    setActiveSection("grupos")
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleBackToAttendance = () => {
    setSelectedGroup(null)
    setActiveSection("asistencia")
  }

  const handleBackToCalendar = () => {
    setSelectedDate(null)
    setSelectedGroupId(null)
    setActiveSection("calendario")
  }

  const handleSelectGroupForStatistics = (group: Group) => {
    setSelectedGroup(group)
    setActiveSection("estadisticas")
  }

  const handleViewAttendanceHistory = (group: Group) => {
    setSelectedGroup(group)
    setActiveSection("historial-asistencia")
  }

  const handleViewDay = (date: string, groupId?: string) => {
    setSelectedDate(date)
    if (groupId) {
      setSelectedGroupId(groupId)
      setActiveSection("detalle-dia")
    } else {
      setActiveSection("tomar-asistencia")
    }
  }

  const renderContent = () => {
    // Si es coordinador o admin, mostrar su dashboard especial
    if ((userRole === "coordinator" || userRole === "admin") && activeSection === "coordinador") {
      return <CoordinadorDashboard user={user} />
    }

    switch (activeSection) {
      case "crear-grupo":
        return <CrearGrupoForm onGroupCreated={handleGroupCreated} />
      case "grupos":
        return <ListaGrupos onSelectGroup={handleSelectGroup} refreshTrigger={refreshTrigger} />
      case "gestionar-estudiantes":
        return selectedGroup ? <GestionarEstudiantes group={selectedGroup} onBack={handleBackToGroups} /> : null
      case "asistencia":
        return <SeleccionarGrupo onSelectGroup={handleSelectGroupForAttendance} />
      case "tomar-asistencia":
        return selectedGroup ? <TomarAsistencia group={selectedGroup} onBack={handleBackToAttendance} /> : null
      case "historial-asistencia":
        return selectedGroup ? (
          <HistorialAsistencia group={selectedGroup} onBack={handleBackToAttendance} onViewDay={handleViewDay} />
        ) : null
      case "calendario":
        return <CalendarioAsistencia onViewDay={handleViewDay} />
      case "detalle-dia":
        return selectedDate && selectedGroupId ? (
          <DetalleDia date={selectedDate} groupId={selectedGroupId} onBack={handleBackToCalendar} />
        ) : null
      case "cumpleanos":
        return <SeccionCumpleanos />
      case "estadisticas":
        return selectedGroup ? (
          <EstadisticasAsistencia group={selectedGroup} onBack={handleBackToGroups} />
        ) : (
          <div>
            <p className="mb-4">Selecciona un grupo para ver las estadísticas</p>
            <ListaGrupos onSelectGroup={handleSelectGroupForStatistics} refreshTrigger={refreshTrigger} />
          </div>
        )
      case "exportar":
        return loadingGroups ? (
          <div>Cargando grupos...</div>
        ) : (
          <ExportarPlanilla groups={groups} />
        )
      default:
        return <div>Sección no encontrada</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onMenuToggle={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} />
      <div className="flex flex-1 min-h-0">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          isMobile={true}
          user={user}
        />
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={false}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
