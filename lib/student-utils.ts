import type { Student } from "@/lib/types"

/**
 * Exporta estudiantes a un archivo CSV
 */
export function exportStudentsToCSV(students: Student[], groupName: string): void {
  const headers = ["Nombre Completo", "Email", "DNI", "Fecha de Nacimiento"]
  const rows = students.map((student) => [
    student.full_name,
    student.email,
    student.national_id,
    student.birth_date ? new Date(student.birth_date).toLocaleDateString("es-AR") : "",
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  const fileName = `estudiantes_${groupName}_${new Date().toISOString().split("T")[0]}.csv`
  link.setAttribute("href", url)
  link.setAttribute("download", fileName)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Parsea un archivo CSV y retorna los datos de estudiantes
 */
export async function parseStudentsFromCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.trim().split("\n")

        if (lines.length < 2) {
          reject(new Error("El archivo está vacío o solo contiene encabezados"))
          return
        }

        // Saltar la primera línea (encabezados)
        const students = lines.slice(1).map((line, index) => {
          // Parsear CSV respetando comillas
          const values = line.match(/(".*?"|[^",]+)/g) || []
          const cleanValues = values.map((v) => v.replace(/^"|"$/g, "").trim())

          if (cleanValues.length < 3) {
            throw new Error(
              `Fila ${index + 2}: Faltan datos. Se requieren: Nombre, Email, DNI y opcionalmente Fecha de Nacimiento`
            )
          }

          return {
            full_name: cleanValues[0],
            email: cleanValues[1],
            national_id: cleanValues[2],
            birth_date: cleanValues[3] || null,
          }
        })

        resolve(students)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"))
    }

    reader.readAsText(file)
  })
}

/**
 * Valida que los datos del estudiante sean correctos
 */
export function validateStudentData(student: any): { valid: boolean; error?: string } {
  if (!student.full_name || !student.full_name.trim()) {
    return { valid: false, error: "Nombre completo es requerido" }
  }

  if (!student.email || !student.email.trim()) {
    return { valid: false, error: "Email es requerido" }
  }

  if (!student.national_id || !student.national_id.trim()) {
    return { valid: false, error: "DNI es requerido" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(student.email)) {
    return { valid: false, error: `Email inválido: ${student.email}` }
  }

  return { valid: true }
}
