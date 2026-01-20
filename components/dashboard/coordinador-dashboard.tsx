"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Users, BookOpen, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
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
  attendanceRate: number
  absentStudents: number
}

interface AttendanceStats {
  total: number
  present: number
  absent: number
  rate: number
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
    globalAttendanceRate: 0,
    totalAbsences: 0,
  })
  const [lowAttendanceGroups, setLowAttendanceGroups] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()

        console.log("[Client] Loading admin dashboard data...")

        // Traer directamente desde el cliente
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("*")
          .neq("role", "admin")
          .order("full_name")

        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .order("name")

        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .order("full_name")

        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*")

        console.log("[Client] Loaded - Teachers:", teacherData?.length || 0, "Groups:", groupData?.length || 0, "Students:", studentData?.length || 0)

        if (teacherError) {
          console.error("[Client] Teacher error:", teacherError)
          setError(`Error traendo profesores: ${teacherError.message}`)
          return
        }

        const teachersArray = teacherData || []
        const groupsArray = groupData || []
        const studentsArray = studentData || []
        const attendanceArray = attendanceData || []

        setGroups(groupsArray)
        setStudents(studentsArray)

        const teacherStats: TeacherStats[] = teachersArray.map((teacher) => {
          const teacherGroups = groupsArray.filter((g) => g.teacher_id === teacher.id)
          const teacherStudents = studentsArray.filter((s) =>
            teacherGroups.some((g) => g.id === s.group_id)
          )
          const teacherAttendance = attendanceArray.filter((a) =>
            teacherGroups.some((g) => g.id === a.group_id)
          )
          
          const presentCount = teacherAttendance.filter((a) => a.present).length
          const attendanceRate = teacherAttendance.length > 0 
            ? Math.round((presentCount / teacherAttendance.length) * 100)
            : 0
          
          const absentCount = teacherAttendance.filter((a) => !a.present).length
          
          return {
            teacher,
            groupCount: teacherGroups.length,
            studentCount: teacherStudents.length,
            totalAttendance: teacherAttendance.length,
            attendanceRate,
            absentStudents: absentCount,
          }
        })

        setTeachers(teacherStats)

        // Calcular grupos con baja asistencia
        const groupAttendance = groupsArray.map((group) => {
          const groupAttendanceRecords = attendanceArray.filter((a) => a.group_id === group.id)
          const presentCount = groupAttendanceRecords.filter((a) => a.present).length
          const rate = groupAttendanceRecords.length > 0 
            ? Math.round((presentCount / groupAttendanceRecords.length) * 100)
            : 0
          return { group, rate, total: groupAttendanceRecords.length, present: presentCount }
        })

        const lowAttendance = groupAttendance
          .filter((ga) => ga.total > 0 && ga.rate < 80)
          .sort((a, b) => a.rate - b.rate)
          .slice(0, 5)

        setLowAttendanceGroups(lowAttendance)

        // Stats globales
        const totalPresent = attendanceArray.filter((a) => a.present).length
        const globalRate = attendanceArray.length > 0
          ? Math.round((totalPresent / attendanceArray.length) * 100)
          : 0

        setStats({
          totalTeachers: teachersArray.length,
          totalGroups: groupsArray.length,
          totalStudents: studentsArray.length,
          totalAttendanceRecords: attendanceArray.length,
          globalAttendanceRate: globalRate,
          totalAbsences: attendanceArray.length - totalPresent,
        })

        setLoading(false)
      } catch (err: any) {
        console.error("[Client] Error loading coordinator data:", err)
        setError(`Error: ${err.message}`)
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error al cargar el dashboard</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Panel del Coordinador</h1>
        <p className="text-gray-600">Gestión centralizada de profesores, grupos y asistencias</p>
      </div>

      {/* Stats generales mejoradas */}
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

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Asistencia Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.globalAttendanceRate}%</div>
            <p className="text-xs text-blue-600 mt-1">{stats.totalAbsences} ausencias</p>
          </CardContent>
        </Card>
      </div>

      {/* Grupos con baja asistencia */}
      {lowAttendanceGroups.length > 0 && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              Grupos con Baja Asistencia
            </CardTitle>
            <CardDescription className="text-orange-600">Requieren atención prioritaria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowAttendanceGroups.map((ga) => (
                <div key={ga.group.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-semibold text-sm">{ga.group.name}</p>
                    <p className="text-xs text-gray-600">{ga.total} registros</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${ga.rate < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                      {ga.rate}%
                    </div>
                    <p className="text-xs text-gray-500">{ga.present} presentes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Asistencia
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Ausencias
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
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
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ts.attendanceRate >= 80 
                            ? 'bg-green-100 text-green-800' 
                            : ts.attendanceRate >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ts.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ts.absentStudents > 10
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ts.absentStudents}
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
