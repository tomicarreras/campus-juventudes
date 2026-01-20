"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Users, BookOpen, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Teacher, Group, Student, Attendance } from "@/lib/types"

interface CoordinadorDashboardProps {
  user: any
}

interface TeacherStats {
  teacher: Teacher
  groupCount: number
  studentCount: number
  totalAttendance: number
}

export default function CoordinadorDashboard({ user }: CoordinadorDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [teachers, setTeachers] = useState<TeacherStats[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalGroups: 0,
    totalStudents: 0,
    totalAttendanceRecords: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()

        // Traer todos los profesores (role = 'teacher' o 'coordinator', NO admin)
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("*")
          .in("role", ["teacher", "coordinator"])
          .order("full_name")

        if (teacherError && teacherError.code !== "PGRST116") {
          console.error("Teacher error:", teacherError)
        }

        // Traer todos los grupos
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .order("name")

        if (groupError && groupError.code !== "PGRST116") {
          console.error("Group error:", groupError)
        }

        // Traer todos los estudiantes
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .order("full_name")

        if (studentError && studentError.code !== "PGRST116") {
          console.error("Student error:", studentError)
        }

        // Traer todas las asistencias
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*")

        if (attendanceError && attendanceError.code !== "PGRST116") {
          console.error("Attendance error:", attendanceError)
        }

        const teachersArray = teacherData || []
        const groupsArray = groupData || []
        const studentsArray = studentData || []
        const attendanceArray = attendanceData || []

        setGroups(groupsArray)
        setStudents(studentsArray)

        // Calcular stats por profesor
        const teacherStats: TeacherStats[] = teachersArray.map((teacher) => ({
          teacher,
          groupCount: groupsArray.filter((g) => g.teacher_id === teacher.id).length,
          studentCount: studentsArray.filter((s) =>
            groupsArray.some((g) => g.id === s.group_id && g.teacher_id === teacher.id)
          ).length,
          totalAttendance: attendanceArray.filter((a) =>
            groupsArray.some((g) => g.id === a.group_id && g.teacher_id === teacher.id)
          ).length,
        }))

        setTeachers(teacherStats)

        // Stats generales
        setStats({
          totalTeachers: teachersArray.length,
          totalGroups: groupsArray.length,
          totalStudents: studentsArray.length,
          totalAttendanceRecords: attendanceArray.length,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error loading coordinator data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredTeachers = teachers.filter(
    (ts) =>
      ts.teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ts.teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Panel del Coordinador</h1>
        <p className="text-gray-600">Gestión centralizada de profesores, grupos y asistencias</p>
      </div>

      {/* Stats generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Profesores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-500 mt-1">Profesores registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Grupos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-gray-500 mt-1">Grupos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Estudiantes totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Asistencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAttendanceRecords}</div>
            <p className="text-xs text-gray-500 mt-1">Registros totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Listado de Profesores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profesores y sus Estadísticas
          </CardTitle>
          <CardDescription>Seguimiento de actividad por profesor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Profesor</th>
                  <th className="text-center py-3 px-4 font-semibold">Email</th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <BookOpen className="h-4 w-4 inline mr-1" />
                    Grupos
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <Users className="h-4 w-4 inline mr-1" />
                    Estudiantes
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Asistencias
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No hay profesores registrados
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((ts) => (
                    <tr key={ts.teacher.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{ts.teacher.full_name}</td>
                      <td className="py-3 px-4 text-center text-gray-600 text-xs">{ts.teacher.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {ts.groupCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {ts.studentCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {ts.totalAttendance}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ultimos Grupos */}
      <Card>
        <CardHeader>
          <CardTitle>Grupos Recientes</CardTitle>
          <CardDescription>Últimos {Math.min(5, groups.length)} grupos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay grupos registrados</p>
          ) : (
            <div className="space-y-3">
              {groups.slice(0, 5).map((group) => (
                <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base">{group.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{group.place}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(group.schedule_date).toLocaleDateString("es-AR")}
                      </div>
                      {group.schedule_time && <div className="text-xs text-gray-500">{group.schedule_time}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
