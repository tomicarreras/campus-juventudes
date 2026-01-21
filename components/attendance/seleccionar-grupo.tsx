"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Clock, CheckSquare, ArrowUp, ArrowDown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/auth"
import type { Group } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface SeleccionarGrupoProps {
  onSelectGroup: (group: Group) => void
}

export default function SeleccionarGrupo({ onSelectGroup }: SeleccionarGrupoProps) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const { user } = await getCurrentUser()
        if (!user) return

        const { data, error } = await supabase
          .from("groups")
          .select(`
            *,
            students(count)
          `)
          .eq("teacher_id", user.id)
          .order("order", { ascending: true })

        if (error) throw error

        setGroups(data || [])
      } catch (error) {
        console.error("Error loading groups:", error)
      } finally {
        setLoading(false)
      }
    }

    loadGroups()
  }, [])

  const handleReorder = async (groupId: string, direction: 'up' | 'down') => {
    const currentIndex = groups.findIndex(g => g.id === groupId)
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === groups.length - 1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    try {
      // Intercambiar órdenes
      const currentOrder = groups[currentIndex].order || 0
      const swapOrder = groups[newIndex].order || 0

      await supabase.from("groups").update({ order: swapOrder }).eq("id", groupId)
      await supabase.from("groups").update({ order: currentOrder }).eq("id", groups[newIndex].id)

      // Recargar grupos
      const { user } = await getCurrentUser()
      if (!user) return

      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          students(count)
        `)
        .eq("teacher_id", user.id)
        .order("order", { ascending: true })

      if (!error) setGroups(data || [])
    } catch (error) {
      toast({ title: "Error", description: "No se pudo reordenar el grupo", variant: "destructive" })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando grupos...</div>
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenés grupos creados</h3>
          <p className="text-gray-600">Creá un grupo primero para poder tomar asistencia.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Seleccionar Grupo para Asistencia</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {groups.map((group, index) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReorder(group.id, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                    title="Mover arriba"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReorder(group.id, 'down')}
                    disabled={index === groups.length - 1}
                    className="h-8 w-8 p-0"
                    title="Mover abajo"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base sm:text-lg truncate">{group.name}</CardTitle>
                  {group.description && (
                    <CardDescription className="mt-1 text-xs sm:text-sm line-clamp-2">{group.description}</CardDescription>
                  )}
                </div>
                <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                  {(group as any).students?.[0]?.count || 0} estudiantes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{group.place}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  {(() => {
                    const [year, month, day] = group.schedule_date.split("-").map(Number)
                    return new Date(year, month - 1, day).toLocaleDateString("es-AR")
                  })()}
                </div>
                {group.schedule_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    {group.schedule_time}
                  </div>
                )}
              </div>
              <Button onClick={() => onSelectGroup(group)} className="w-full text-sm">
                <CheckSquare className="h-4 w-4 mr-2" />
                Tomar Asistencia
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
