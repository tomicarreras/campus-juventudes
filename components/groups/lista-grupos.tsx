"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import EditarGrupoForm from "@/components/groups/editar-grupo-form"
import { toast } from "@/hooks/use-toast"
import type { Group } from "@/lib/types"
import { Copy, GripVertical } from "lucide-react"

interface ListaGruposProps {
  refreshTrigger?: number
  onSelectGroup?: (group: Group) => void
}

export default function ListaGrupos({ refreshTrigger, onSelectGroup }: ListaGruposProps) {
  const [grupos, setGrupos] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState<string | null>(null)
  const [draggedGroup, setDraggedGroup] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Fetch groups
  const fetchGroups = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("groups").select("*").order("order", { ascending: true })
    if (!error && data) setGrupos(data)
    setLoading(false)
  }

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchGroups()
    // eslint-disable-next-line
  }, [refreshTrigger])

  const handleDelete = async (groupId: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este grupo? Esta acción no se puede deshacer.")) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from("groups").delete().eq("id", groupId)
    setDeleting(false)
    if (error) {
      toast({ title: "Error", description: "No se pudo borrar el grupo", variant: "destructive" })
    } else {
      toast({ title: "Grupo borrado", description: "El grupo fue eliminado correctamente" })
      fetchGroups()
    }
  }

  const handleDuplicate = async (groupId: string) => {
    setDuplicating(groupId)
    const supabase = createClient()
    
    try {
      // Obtener el grupo original
      const { data: originalGroup, error: fetchError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single()

      if (fetchError || !originalGroup) throw new Error("No se pudo obtener el grupo")

      // Crear nuevo grupo con nombre copiado
      const newGroupName = `${originalGroup.name} (Copia)`
      const { data: newGroup, error: createError } = await supabase
        .from("groups")
        .insert([
          {
            name: newGroupName,
            description: originalGroup.description,
            place: originalGroup.place,
            schedule_date: originalGroup.schedule_date,
            schedule_time: originalGroup.schedule_time,
            teacher_id: originalGroup.teacher_id,
          },
        ])
        .select()
        .single()

      if (createError || !newGroup) throw new Error("No se pudo crear el grupo duplicado")

      // Obtener todos los estudiantes del grupo original
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("group_id", groupId)

      if (studentsError) throw new Error("No se pudo obtener los estudiantes")

      // Copiar estudiantes al nuevo grupo
      if (students && students.length > 0) {
        const newStudents = students.map(({ id, created_at, updated_at, ...student }) => ({
          ...student,
          group_id: newGroup.id,
        }))

        const { error: insertError } = await supabase.from("students").insert(newStudents)

        if (insertError) throw new Error("No se pudieron copiar los estudiantes")
      }

      toast({
        title: "Grupo duplicado",
        description: `${newGroupName} ha sido creado correctamente con ${students?.length || 0} estudiantes`,
      })
      fetchGroups()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo duplicar el grupo",
        variant: "destructive",
      })
    } finally {
      setDuplicating(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, groupId: string) => {
    setDraggedGroup(groupId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, targetGroupId: string, targetIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    
    if (!draggedGroup || draggedGroup === targetGroupId) {
      setDraggedGroup(null)
      return
    }

    const draggedIndex = grupos.findIndex(g => g.id === draggedGroup)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedGroup(null)
      return
    }

    const supabase = createClient()

    try {
      // Actualización optimista: reordenar localmente de inmediato
      const newGrupos = [...grupos]
      ;[newGrupos[draggedIndex], newGrupos[targetIndex]] = [newGrupos[targetIndex], newGrupos[draggedIndex]]
      setGrupos(newGrupos)

      // Luego actualizar en la BD en background
      const draggedOrder = grupos[draggedIndex].order || 0
      const targetOrder = grupos[targetIndex].order || 0

      await supabase.from("groups").update({ order: targetOrder }).eq("id", draggedGroup)
      await supabase.from("groups").update({ order: draggedOrder }).eq("id", targetGroupId)
    } catch (error) {
      toast({ title: "Error", description: "No se pudo reordenar el grupo", variant: "destructive" })
      // Si falla, recargar para sincronizar con la BD
      fetchGroups()
    } finally {
      setDraggedGroup(null)
    }
  }

  const handleReorder = async (groupId: string, direction: 'up' | 'down') => {
    const currentIndex = grupos.findIndex(g => g.id === groupId)
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === grupos.length - 1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const supabase = createClient()

    try {
      // Intercambiar órdenes
      const currentOrder = grupos[currentIndex].order || 0
      const swapOrder = grupos[newIndex].order || 0

      await supabase.from("groups").update({ order: swapOrder }).eq("id", groupId)
      await supabase.from("groups").update({ order: currentOrder }).eq("id", grupos[newIndex].id)

      fetchGroups()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo reordenar el grupo", variant: "destructive" })
    }
  }

  if (editingGroup) {
    return (
      <EditarGrupoForm
        group={editingGroup}
        onUpdated={() => { setEditingGroup(null); fetchGroups(); }}
        onCancel={() => setEditingGroup(null)}
      />
    )
  }

  if (loading) return <div className="text-center py-8">Cargando grupos...</div>

  return (
    <div className="space-y-3">
      {grupos.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No hay grupos creados aún. ¡Crea el primero!
        </div>
      ) : (
        grupos.map((group, index) => (
          <div key={group.id}>
            {dragOverIndex === index && draggedGroup !== group.id && (
              <div className="h-1 bg-blue-500 rounded-full mb-2 animate-pulse"></div>
            )}
            <div 
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg transition ${
                draggedGroup === group.id 
                  ? 'bg-blue-100 shadow-lg scale-105 border-blue-400' 
                  : dragOverIndex === index ? 'bg-blue-50 border-blue-300'
                  : 'hover:bg-gray-50 cursor-grab active:cursor-grabbing'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, group.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, group.id, index)}
            >
              <div className="flex items-center gap-2">
                <GripVertical className={`h-5 w-5 flex-shrink-0 transition ${
                  draggedGroup === group.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`} />
              </div>
            <div 
              className="flex-1 cursor-pointer hover:underline min-w-0"
              onClick={() => onSelectGroup && onSelectGroup(group)}
            >
              <h3 className="font-semibold text-sm sm:text-base truncate">{group.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{group.place}</p>
              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                {(group as any).days && <p>Día/s: {(group as any).days}</p>}
                {(group as any).year && <p>Año: {(group as any).year}</p>}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                size="sm" 
                onClick={() => setEditingGroup(group)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                Editar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDuplicate(group.id)}
                disabled={duplicating === group.id}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                {duplicating === group.id ? (
                  "Duplicando..."
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Duplicar</span>
                  </>
                )}
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleDelete(group.id)} 
                disabled={deleting}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                {deleting ? "Borrando..." : "Borrar"}
              </Button>
            </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}