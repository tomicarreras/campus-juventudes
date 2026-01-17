# DIAGRAMA DE FLUJOS Y ESTRUCTURAS

## 1. FLUJO DE EXPORTACIÓN

```
Gestionar Estudiantes
    ↓
[Existe al menos 1 estudiante?]
    ├─ NO → Botón deshabilitado
    └─ SI → Botón habilitado
        ↓
    [Haz clic: Descargar CSV]
        ↓
    exportStudentsToCSV(students, groupName)
        ├─ Crea headers: ["Nombre", "Email", "DNI", "Fecha"]
        ├─ Mapea estudiantes a filas
        ├─ Formatea fechas (es-AR)
        ├─ Genera CSV con comillas
        ├─ Crea Blob
        └─ Descarga automática
            ↓
    Archivo: estudiantes_[nombre]_YYYY-MM-DD.csv
```

---

## 2. FLUJO DE IMPORTACIÓN

```
Gestionar Estudiantes
    ↓
[Selecciona archivo CSV]
    ↓
[Haz clic: Importar]
    ↓
parseStudentsFromCSV(file)
    ├─ Lee archivo con FileReader
    ├─ Divide en líneas
    ├─ Salta encabezados (línea 1)
    ├─ Parsea cada línea respetando comillas
    └─ Retorna array de objetos
        ↓
Para cada estudiante:
    ├─ validateStudentData(student)
    │   ├─ ¿Nombre válido? → NO = Error
    │   ├─ ¿Email válido? → NO = Error
    │   ├─ ¿DNI válido? → NO = Error
    │   └─ ✓ Pasa validación
    │
    ├─ ¿Ya existe en DB (mismo DNI, grupo)?
    │   └─ SI = Omite
    │
    └─ insert en Supabase
        ├─ ✓ Éxito = addedCount++
        └─ ✗ Error = skippedCount++
            ↓
Resultado: "Se importaron X exitosamente (Y omitidos)"
```

---

## 3. FLUJO DE MOVIMIENTO

```
Gestionar Estudiantes
    ↓
[Sección: Mover Estudiante]
    ├─ [¿Hay estudiantes?] → NO = No se muestra
    └─ [¿Hay estudiantes?] → SI
        ↓
    [Selecciona Estudiante]
        ↓
    [Selecciona Grupo Destino]
        ├─ Filtra: grupo != grupo.actual
        └─ Muestra: nombre - lugar
        ↓
    [Haz clic: Mover Estudiante]
        ↓
    [¿Datos válidos?]
        ├─ NO → Error: "Selecciona estudiante y grupo"
        └─ SI:
            ↓
        update students
            set group_id = targetGroupForMove
            where id = selectedStudentForMove
            ↓
        ✓ Success → "Nombre fue movido exitosamente"
        Limpia selecciones
        Recarga lista
```

---

## 4. ESTRUCTURA DE DATOS

### Interfaz Student
```typescript
interface Student {
  id: string
  email: string
  full_name: string
  national_id: string
  birth_date?: string
  group_id: string
  created_at: string
  updated_at: string
  group?: Group
}
```

### Interfaz Group
```typescript
interface Group {
  id: string
  name: string
  description?: string
  place: string
  schedule_date: string
  schedule_time?: string
  teacher_id: string
  created_at: string
  updated_at: string
  teacher?: Teacher
}
```

### Formato CSV de Entrada/Salida
```
Nombre Completo,Email,DNI,Fecha de Nacimiento
"García, Juan",juan@mail.com,12345678,1995-05-15
"López, María",maria@mail.com,87654321,1996-08-20
```

---

## 5. FUNCIONES PRINCIPALES

### `exportStudentsToCSV(students, groupName)`
**Entrada:** Array<Student>, string
**Proceso:** Mapea a CSV, crea Blob, descarga
**Salida:** Descarga automática del navegador

### `parseStudentsFromCSV(file)`
**Entrada:** File (CSV)
**Proceso:** Lee, parsea líneas, mapea a objetos
**Salida:** Promise<Array<StudentData>>

### `validateStudentData(student)`
**Entrada:** StudentData object
**Proceso:** Valida nombre, email, DNI
**Salida:** { valid: boolean, error?: string }

---

## 6. ESTADOS REACT (Componente)

```typescript
const [students, setStudents]                      // Lista de estudiantes
const [loading, setLoading]                        // Agregar estudiante
const [error, setError]                            // Errores
const [success, setSuccess]                        // Éxitos
const [allGroups, setAllGroups]                    // Para mover
const [importFile, setImportFile]                  // Archivo CSV
const [importLoading, setImportLoading]            // Importando
const [selectedStudentForMove, setSelectedStudentForMove]      // Mover
const [targetGroupForMove, setTargetGroupForMove]  // Grupo destino
const [moveLoading, setMoveLoading]                // Moviendo
```

---

## 7. VALIDACIONES EN CASCADE

```
┌─ VALIDACIÓN NIVEL 1: UI
│   └─ ¿Archivo seleccionado? SI/NO
│   └─ ¿Estudiante seleccionado? SI/NO
│   └─ ¿Grupo destino seleccionado? SI/NO
│
├─ VALIDACIÓN NIVEL 2: Datos
│   └─ ¿Nombre no vacío? ✓
│   └─ ¿Email válido? ✓ (regex: user@domain.com)
│   └─ ¿DNI no vacío? ✓
│
├─ VALIDACIÓN NIVEL 3: Base de Datos
│   └─ ¿Ya existe? (Supabase query)
│
└─ RESULTADO
    ├─ ✓ Pasa todo → INSERT/UPDATE
    └─ ✗ Falla algo → Error + Skip
```

---

## 8. MANEJO DE ERRORES

```
TRY
├─ Lectura de archivo
├─ Parseo CSV
├─ Validación de datos
├─ Consultas Supabase
└─ Actualizaciones
    ↓
CATCH
├─ Error específico
├─ Mensaje al usuario
├─ Log en consola (dev)
└─ UI: Alert rojo
```

---

## 9. INTERFAZ VISUAL - Orden en Página

```
┌─────────────────────────────────┐
│ [← Volver] Nombre Grupo         │
├─────────────────────────────────┤
│ [ALERTAS: Error/Success]        │
├─────────────────────────────────┤
│ AGREGAR ESTUDIANTE              │
│ [Formulario]                    │
├─────────────────────────────────┤
│ ┌───────────────┬───────────────┐
│ │ EXPORTAR      │ IMPORTAR      │
│ │ [CSV Button]  │ [Upload Form] │
│ └───────────────┴───────────────┘
├─────────────────────────────────┤
│ MOVER ESTUDIANTE (si hay datos) │
│ [Selects + Button]              │
├─────────────────────────────────┤
│ LISTA DE ESTUDIANTES            │
│ [Estudiante 1]  [❌ Borrar]     │
│ [Estudiante 2]  [❌ Borrar]     │
└─────────────────────────────────┘
```

---

## 10. COMPATIBILIDAD

✅ React 18+
✅ Next.js 14+ (App Router)
✅ TypeScript
✅ Tailwind CSS
✅ shadcn/ui Components
✅ Supabase Client
✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
✅ Responsive (Mobile, Tablet, Desktop)

