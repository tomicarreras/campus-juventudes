"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, ArrowLeft, Trash2, Users, Download, Upload, ArrowRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { exportStudentsToCSV, parseStudentsFromCSV, validateStudentData } from "@/lib/student-utils"
import type { Group, Student } from "@/lib/types"

interface GestionarEstudiantesProps {
  group: Group
  onBack: () => void
}

export default function GestionarEstudiantes({ group, onBack }: GestionarEstudiantesProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [allGroups, setAllGroups] = useState<Group[]>([])
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [selectedStudentForMove, setSelectedStudentForMove] = useState<string | null>(null)
  const [targetGroupForMove, setTargetGroupForMove] = useState<string | null>(null)
  const [moveLoading, setMoveLoading] = useState(false)

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase.from("students").select("*").eq("group_id", group.id).order("full_name")

      if (error) throw error
      setStudents(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadAllGroups = async () => {
    try {
      const { data, error } = await supabase.from("groups").select("*").order("name")

      if (error) throw error
      setAllGroups(data || [])
    } catch (err: any) {
      console.error("Error loading groups:", err)
    }
  }

  useEffect(() => {
    loadStudents()
    loadAllGroups()
  }, [group.id])

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    const nationalId = formData.get("nationalId") as string
    const birthDate = formData.get("birthDate") as string

    try {
      const { error: insertError } = await supabase.from("students").insert([
        {
          email,
          full_name: fullName,
          national_id: nationalId,
          birth_date: birthDate || null,
          group_id: group.id,
        },
      ])

      if (insertError) throw insertError

      setSuccess("Estudiante agregado exitosamente")
      ;(e.target as HTMLFormElement).reset()
      loadStudents()
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar este estudiante?")) return

    try {
      const { error } = await supabase.from("students").delete().eq("id", studentId)

      if (error) throw error

      setSuccess("Estudiante eliminado exitosamente")
      loadStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleExportStudents = () => {
    if (students.length === 0) {
      setError("No hay estudiantes para exportar")
      return
    }

    try {
      exportStudentsToCSV(students, group.name)
      setSuccess(`Se exportaron ${students.length} estudiante(s)`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleImportStudents = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!importFile) {
      setError("Selecciona un archivo para importar")
      return
    }

    setImportLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const parsedStudents = await parseStudentsFromCSV(importFile)

      let addedCount = 0
      let skippedCount = 0
      const errors: string[] = []

      for (const studentData of parsedStudents) {
        const validation = validateStudentData(studentData)
        if (!validation.valid) {
          errors.push(`${studentData.full_name}: ${validation.error}`)
          skippedCount++
          continue
        }

        // Verificar si el estudiante ya existe en este grupo
        let existingStudent = null
        let retries = 0
        while (retries < 3) {
          try {
            const { data } = await supabase
              .from("students")
              .select("id")
              .eq("national_id", studentData.national_id)
              .eq("group_id", group.id)
              .single()
            existingStudent = data
            break
          } catch (err) {
            retries++
            if (retries < 3) {
              await new Promise(resolve => setTimeout(resolve, 500))
            }
          }
        }

        if (existingStudent) {
          skippedCount++
          continue
        }

        // Reintentar la inserción si falla por timeout
        let insertError = null
        let insertRetries = 0
        while (insertRetries < 3) {
          try {
            const result = await supabase.from("students").insert([
              {
                ...studentData,
                group_id: group.id,
              },
            ])
            insertError = result.error
            if (!insertError) {
              break
            }
            insertRetries++
            if (insertRetries < 3) {
              await new Promise(resolve => setTimeout(resolve, 500))
            }
          } catch (err: any) {
            insertError = err
            insertRetries++
            if (insertRetries < 3) {
              await new Promise(resolve => setTimeout(resolve, 500))
            }
          }
        }

        if (insertError) {
          errors.push(`${studentData.full_name}: ${insertError.message || insertError}`)
          skippedCount++
        } else {
          addedCount++
        }
      }

      if (addedCount > 0) {
        setSuccess(
          `Se importaron ${addedCount} estudiante(s) exitosamente${skippedCount > 0 ? ` (${skippedCount} omitido(s))` : ""}`
        )
        loadStudents()
        setImportFile(null)
        ;(e.target as HTMLFormElement).reset()
      } else {
        setError(`No se pudo importar ningún estudiante. ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? `... y ${errors.length - 3} más` : ""}`)
      }

      if (errors.length > 0) {
        console.warn("Import errors:", errors)
      }
    } catch (err: any) {
      setError(err.message)
    }

    setImportLoading(false)
  }

  const handleMoveStudent = async () => {
    if (!selectedStudentForMove || !targetGroupForMove) {
      setError("Selecciona un estudiante y un grupo destino")
      return
    }

    setMoveLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const studentToMove = students.find((s) => s.id === selectedStudentForMove)
      if (!studentToMove) throw new Error("Estudiante no encontrado")

      const { error } = await supabase
        .from("students")
        .update({ group_id: targetGroupForMove })
        .eq("id", selectedStudentForMove)

      if (error) throw error

      setSuccess(`${studentToMove.full_name} fue movido a otro grupo exitosamente`)
      setSelectedStudentForMove(null)
      setTargetGroupForMove(null)
      loadStudents()
    } catch (err: any) {
      setError(err.message)
    }

    setMoveLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{group.name}</h2>
          <p className="text-gray-600">
            {group.place} - {new Date(group.schedule_date).toLocaleDateString("es-AR")}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Add Student Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Agregar Estudiante
          </CardTitle>
          <CardDescription>Completá los datos del estudiante para agregarlo al grupo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nombre completo *
                </label>
                <Input id="fullName" name="fullName" placeholder="Nombre y apellido" required disabled={loading} />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="estudiante@ejemplo.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nationalId" className="text-sm font-medium">
                  DNI *
                </label>
                <Input id="nationalId" name="nationalId" placeholder="12345678" required disabled={loading} />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-sm font-medium">
                  Fecha de Nacimiento
                </label>
                <Input id="birthDate" name="birthDate" type="date" disabled={loading} />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar Estudiante"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Export and Import Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Export Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Estudiantes
            </CardTitle>
            <CardDescription>Descargar la lista de estudiantes en formato CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportStudents}
              disabled={students.length === 0}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar CSV ({students.length} estudiante{students.length !== 1 ? "s" : ""})
            </Button>
          </CardContent>
        </Card>

        {/* Import Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Estudiantes
            </CardTitle>
            <CardDescription>Cargar estudiantes desde un archivo CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImportStudents} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="csvFile" className="text-sm font-medium">
                  Archivo CSV
                </label>
                <Input
                  id="csvFile"
                  name="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  disabled={importLoading}
                />
                <p className="text-xs text-gray-500">
                  El archivo debe tener columnas: Nombre Completo, Email, DNI, Fecha de Nacimiento (opcional)
                </p>
              </div>

              <Button type="submit" disabled={importLoading || !importFile} className="w-full">
                {importLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Move Student */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Mover Estudiante a Otro Grupo
            </CardTitle>
            <CardDescription>Transferir un estudiante a un grupo diferente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estudiante *</label>
                  <Select value={selectedStudentForMove || ""} onValueChange={setSelectedStudentForMove}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Grupo Destino *</label>
                  <Select value={targetGroupForMove || ""} onValueChange={setTargetGroupForMove}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {allGroups
                        .filter((g) => g.id !== group.id)
                        .map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name} - {g.place}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleMoveStudent} disabled={moveLoading || !selectedStudentForMove || !targetGroupForMove}>
                {moveLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Moviendo...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Mover Estudiante
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estudiantes ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No hay estudiantes en este grupo. Agregá el primero usando el formulario de arriba.
            </p>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{student.full_name}</h4>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{student.email}</span>
                      <span>DNI: {student.national_id}</span>
                      {student.birth_date && (
                        <span>Nació: {new Date(student.birth_date).toLocaleDateString("es-AR")}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
