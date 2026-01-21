"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { Badge } from "@/components/ui/badge"
import type { Group } from "@/lib/types"

interface EstadisticasAsistenciaProps {
  group: Group
  onBack: () => void
}

interface StudentStats {
  id: string
  full_name: string
  email: string
  total_classes: number
  present: number
  absent: number
  percentage: number
}

interface MonthlyStats {
  month: string
  present: number
  absent: number
}

interface StudentAbsenceRanking {
  name: string
  absences: number
  percentage: number
}

export default function EstadisticasAsistencia({ group, onBack }: EstadisticasAsistenciaProps) {
  const [studentStats, setStudentStats] = useState<StudentStats[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [absenceRanking, setAbsenceRanking] = useState<StudentAbsenceRanking[]>([])
  const [groupStats, setGroupStats] = useState({ total: 0, average: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [group.id])

  const loadStatistics = async () => {
    try {
      const supabase = createClient()

      // Obtener todos los estudiantes del grupo
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("id, full_name, email")
        .eq("group_id", group.id)

      if (studentsError) throw studentsError

      // Obtener asistencias del grupo
      const { data: attendances, error: attendancesError } = await supabase
        .from("attendance")
        .select("student_id, present, date")
        .eq("group_id", group.id)

      if (attendancesError) throw attendancesError

      // Calcular estadísticas por estudiante
      const stats = students?.map((student) => {
        const studentAttendances = attendances?.filter((a) => a.student_id === student.id) || []
        const presentCount = studentAttendances.filter((a) => a.present).length
        const absentCount = studentAttendances.filter((a) => !a.present).length
        const total = studentAttendances.length

        return {
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          total_classes: total,
          present: presentCount,
          absent: absentCount,
          percentage: total > 0 ? Math.round((presentCount / total) * 100) : 0,
        }
      }) || []

      setStudentStats(stats)

      // Calcular promedio general
      const totalPercentages = stats.reduce((sum, s) => sum + s.percentage, 0)
      const averagePercentage = stats.length > 0 ? Math.round(totalPercentages / stats.length) : 0
      setGroupStats({
        total: stats.length,
        average: averagePercentage,
      })

      // Calcular estadísticas mensuales
      const monthlyMap = new Map<string, { present: number; absent: number }>()
      attendances?.forEach((attendance) => {
        const [year, month] = attendance.date.split("-")
        const key = `${month}/${year}`

        if (!monthlyMap.has(key)) {
          monthlyMap.set(key, { present: 0, absent: 0 })
        }

        const current = monthlyMap.get(key)!
        if (attendance.present) {
          current.present++
        } else {
          current.absent++
        }
      })

      const monthly = Array.from(monthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          present: data.present,
          absent: data.absent,
        }))

      setMonthlyStats(monthly)

      // Calcular ranking de ausencias
      const ranking = stats
        .filter((s) => s.total_classes > 0)
        .sort((a, b) => b.absent - a.absent)
        .slice(0, 10)
        .map((s) => ({
          name: s.full_name.split(" ")[0],
          absences: s.absent,
          percentage: 100 - s.percentage,
        }))

      setAbsenceRanking(ranking)
      setLoading(false)
    } catch (error) {
      console.error("Error loading statistics:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando estadísticas...</div>
  }

  const presenceData = [
    { name: "Presente", value: studentStats.reduce((sum, s) => sum + s.present, 0) },
    { name: "Ausente", value: studentStats.reduce((sum, s) => sum + s.absent, 0) },
  ]

  const COLORS = ["#10b981", "#ef4444"]

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-blue-600 hover:underline mb-4">
        ← Volver
      </button>

      <div>
        <h2 className="text-2xl font-bold">{group.name} - Estadísticas de Asistencia</h2>
        <div className="text-sm text-gray-600 mt-2 space-y-0.5">
          {(group as any).days && <p>📅 Día/s: {(group as any).days}</p>}
          {(group as any).year && <p>Año: {(group as any).year}</p>}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Asistencia Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupStats.average}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentStats.reduce((sum, s) => sum + s.total_classes, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Asistencia General */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asistencia General</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {presenceData[0].value + presenceData[1].value > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={presenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {presenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-12">Sin datos de asistencia</div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Top Ausencias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estudiantes con Más Ausencias</CardTitle>
          </CardHeader>
          <CardContent>
            {absenceRanking.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={absenceRanking}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="absences" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-12">Sin datos disponibles</div>
            )}
          </CardContent>
        </Card>

        {/* Tendencias Mensuales */}
        {monthlyStats.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Tendencias Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabla de Estudiantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalle por Estudiante</CardTitle>
          <CardDescription>Asistencia y ausencias de cada estudiante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold">Estudiante</th>
                  <th className="text-center py-2 px-3 font-semibold">Clases</th>
                  <th className="text-center py-2 px-3 font-semibold">Presente</th>
                  <th className="text-center py-2 px-3 font-semibold">Ausente</th>
                  <th className="text-center py-2 px-3 font-semibold">% Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {studentStats.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="py-2 px-3">
                      <div className="font-medium">{student.full_name}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </td>
                    <td className="text-center py-2 px-3">{student.total_classes}</td>
                    <td className="text-center py-2 px-3">
                      <Badge className="bg-green-100 text-green-800">{student.present}</Badge>
                    </td>
                    <td className="text-center py-2 px-3">
                      <Badge className="bg-red-100 text-red-800">{student.absent}</Badge>
                    </td>
                    <td className="text-center py-2 px-3">
                      <span
                        className={`font-semibold ${
                          student.percentage >= 80 ? "text-green-600" : student.percentage >= 60 ? "text-yellow-600" : "text-red-600"
                        }`}
                      >
                        {student.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
