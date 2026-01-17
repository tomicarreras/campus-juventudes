# REFERENCIA API - Funciones de Utilidad

## 📦 Módulo: `lib/student-utils.ts`

---

## 1. `exportStudentsToCSV()`

### Firma
```typescript
export function exportStudentsToCSV(
  students: Student[], 
  groupName: string
): void
```

### Descripción
Exporta un array de estudiantes a un archivo CSV descargable en el navegador.

### Parámetros
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `students` | `Student[]` | ✓ | Array de estudiantes a exportar |
| `groupName` | `string` | ✓ | Nombre del grupo (para el nombre del archivo) |

### Retorno
`void` - La descarga se dispara automáticamente

### Ejemplo de Uso
```typescript
import { exportStudentsToCSV } from "@/lib/student-utils"

const handleExport = () => {
  exportStudentsToCSV(students, "Grupo A")
}
```

### Archivo Generado
```
Nombre: estudiantes_Grupo A_2024-01-17.csv
Contenido:
  "Nombre Completo","Email","DNI","Fecha de Nacimiento"
  "Juan Pérez","juan@mail.com","12345678","17/01/1995"
  "María García","maria@mail.com","87654321","20/08/1996"
```

### Notas Técnicas
- ✓ Ejecuta en el navegador (client-side)
- ✓ Usa Blob API
- ✓ Todos los valores entrecomillados
- ✓ Fechas formateadas según locale: es-AR (DD/MM/YYYY)
- ✓ No modifica Supabase

---

## 2. `parseStudentsFromCSV()`

### Firma
```typescript
export async function parseStudentsFromCSV(
  file: File
): Promise<any[]>
```

### Descripción
Lee un archivo CSV y lo parsea en un array de objetos de estudiantes.

### Parámetros
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | `File` | ✓ | Archivo CSV cargado del `<input type="file">` |

### Retorno
`Promise<any[]>` - Array de objetos con estructura:
```typescript
{
  full_name: string,
  email: string,
  national_id: string,
  birth_date: string | null
}
```

### Ejemplo de Uso
```typescript
import { parseStudentsFromCSV } from "@/lib/student-utils"

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    try {
      const students = await parseStudentsFromCSV(file)
      console.log(students)
    } catch (error) {
      console.error("Error parsing CSV:", error)
    }
  }
}
```

### Formato CSV Esperado
```
Nombre Completo,Email,DNI,Fecha de Nacimiento
Juan Pérez,juan@mail.com,12345678,1995-01-17
"García, María",maria@mail.com,87654321,1996-08-20
```

### Errores Posibles
```javascript
// Archivo vacío
Error: "El archivo está vacío o solo contiene encabezados"

// Fila incompleta
Error: "Fila 3: Faltan datos. Se requieren: Nombre, Email, DNI y opcionalmente Fecha de Nacimiento"

// Error al leer archivo
Error: "Error al leer el archivo"
```

### Notas Técnicas
- ✓ Usa FileReader API (asincrónico)
- ✓ Respeta entrecomillado en CSV
- ✓ Salta encabezados (primera línea)
- ✓ Trimea espacios en blanco
- ✓ Maneja valores vacíos en birth_date como `null`
- ✓ Ejecuta en el navegador (client-side)

---

## 3. `validateStudentData()`

### Firma
```typescript
export function validateStudentData(
  student: any
): { valid: boolean; error?: string }
```

### Descripción
Valida que los datos de un estudiante cumplan con los requisitos.

### Parámetros
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `student` | `any` | ✓ | Objeto con datos del estudiante |

### Retorno
Objeto de validación:
```typescript
{
  valid: boolean,
  error?: string
}
```

### Ejemplo de Uso
```typescript
import { validateStudentData } from "@/lib/student-utils"

const student = {
  full_name: "Juan Pérez",
  email: "juan@mail.com",
  national_id: "12345678",
  birth_date: "1995-01-17"
}

const validation = validateStudentData(student)
if (validation.valid) {
  console.log("Estudiante válido")
} else {
  console.log("Error:", validation.error)
}
```

### Reglas de Validación

| Campo | Regla | Ejemplo Válido | Ejemplo Inválido |
|-------|-------|---|---|
| `full_name` | No vacío, no solo espacios | "Juan Pérez" | "" o "   " |
| `email` | Formato válido (contiene @) | "user@domain.com" | "userdomain.com" o "" |
| `national_id` | No vacío | "12345678" | "" |
| `birth_date` | Opcional | "1995-01-17" | (puede omitirse) |

### Mensajes de Error
```javascript
{valid: false, error: "Nombre completo es requerido"}
{valid: false, error: "Email es requerido"}
{valid: false, error: "DNI es requerido"}
{valid: false, error: "Email inválido: invalidemail"}
```

### Notas Técnicas
- ✓ Ejecuta en el navegador (client-side)
- ✓ Síncrono
- ✓ Usa regex para validar email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- ✓ Trimea strings antes de validar
- ✓ No consulta base de datos

---

## 🔗 Integración Completa

### Flujo de Importación Recomendado

```typescript
import { 
  parseStudentsFromCSV, 
  validateStudentData 
} from "@/lib/student-utils"
import { supabase } from "@/lib/supabase/client"

async function importStudents(file: File, groupId: string) {
  try {
    // Paso 1: Parsear CSV
    const parsedStudents = await parseStudentsFromCSV(file)
    
    let successCount = 0
    let skipCount = 0
    const errors: string[] = []
    
    // Paso 2: Validar y insertar cada uno
    for (const studentData of parsedStudents) {
      // Validación
      const validation = validateStudentData(studentData)
      if (!validation.valid) {
        errors.push(`${studentData.full_name}: ${validation.error}`)
        skipCount++
        continue
      }
      
      // Verificar duplicado
      const { data: existing } = await supabase
        .from("students")
        .select("id")
        .eq("national_id", studentData.national_id)
        .eq("group_id", groupId)
        .single()
      
      if (existing) {
        skipCount++
        continue
      }
      
      // Insertar
      const { error: insertError } = await supabase
        .from("students")
        .insert([{
          ...studentData,
          group_id: groupId
        }])
      
      if (insertError) {
        errors.push(`${studentData.full_name}: ${insertError.message}`)
        skipCount++
      } else {
        successCount++
      }
    }
    
    return {
      success: true,
      imported: successCount,
      skipped: skipCount,
      errors: errors
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}
```

---

## 📋 Requisitos de Importación

### Archivo CSV
```
Nombre Completo,Email,DNI,Fecha de Nacimiento
...datos...
```

### Requisitos Mínimos
- Al menos 2 líneas (encabezados + 1 datos)
- Columnas en orden: Nombre, Email, DNI, Fecha (opcional)
- Formato de fecha: YYYY-MM-DD (al importar) o libre (al exportar)

### Limitaciones
- Tamaño: Sin límite específico (limita navegador ~50MB)
- Estudiantes: Sin límite
- Caracteres especiales: Soportados (ñ, á, é, etc.)

---

## ⚡ Performance

| Operación | Entrada | Tiempo Aproximado |
|-----------|---------|-------------------|
| Exportar | 100 estudiantes | < 500ms |
| Parsear CSV | 100 estudiantes | < 200ms |
| Validar | 1 estudiante | < 1ms |
| Importar (DB) | 100 estudiantes | 2-5 segundos (Supabase) |

---

## 🔒 Seguridad

- ✓ No incluye contraseñas
- ✓ No ejecuta código arbitrario
- ✓ Valida entrada antes de usar
- ✓ SQL injection: Protegido por Supabase ORM
- ✓ XSS: Valores escapados al exportar CSV

---

## 🐛 Debugging

### Activar Logs
```typescript
// En student-utils.ts, agregar:
console.log("Parsed students:", students)
console.log("Validation result:", validation)
console.log("CSV content:", csvContent)
```

### Errores Comunes

#### "El archivo está vacío"
- **Causa:** CSV sin datos
- **Solución:** Verificar que tenga al menos 2 líneas

#### "Email inválido"
- **Causa:** Email sin @
- **Solución:** Usar formato: user@domain.com

#### "No se encuentra 'students'"
- **Causa:** Supabase no tiene tabla "students"
- **Solución:** Verificar schema en Supabase

---

## 📚 Referencias

- [Blob API](https://developer.mozilla.org/es/docs/Web/API/Blob)
- [FileReader API](https://developer.mozilla.org/es/docs/Web/API/FileReader)
- [RegExp Email](https://regexper.com/)
- [CSV RFC 4180](https://tools.ietf.org/html/rfc4180)

