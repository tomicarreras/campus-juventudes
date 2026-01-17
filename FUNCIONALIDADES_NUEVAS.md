# Nuevas Funcionalidades de Gestión de Estudiantes

## 1. Exportar Estudiantes de un Grupo

**Ubicación:** Componente `gestionar-estudiantes.tsx` - Sección "Exportar Estudiantes"

**Función:** `exportStudentsToCSV(students, groupName)`

**Descripción:** Permite descargar todos los estudiantes de un grupo en formato CSV.

**Características:**
- Descarga un archivo CSV con los datos de todos los estudiantes
- El archivo incluye: Nombre Completo, Email, DNI, Fecha de Nacimiento
- El nombre del archivo incluye el nombre del grupo y la fecha actual

**Ejemplo de uso:**
```typescript
handleExportStudents = () => {
  exportStudentsToCSV(students, group.name)
}
```

**Formato del archivo generado:**
```
estudiantes_NombreDelGrupo_2024-01-17.csv
```

---

## 2. Importar Estudiantes Masivamente

**Ubicación:** Componente `gestionar-estudiantes.tsx` - Sección "Importar Estudiantes"

**Función:** `parseStudentsFromCSV(file)` + `validateStudentData(student)`

**Descripción:** Permite cargar múltiples estudiantes desde un archivo CSV.

**Características:**
- Lee un archivo CSV y parsea los datos
- Valida cada fila antes de insertar
- Evita duplicados (verifica por DNI dentro del grupo)
- Proporciona feedback sobre éxitos y errores
- Maneja errores individuales sin detener la importación total

**Formato requerido del CSV:**
```
Nombre Completo,Email,DNI,Fecha de Nacimiento
Juan Pérez,juan.perez@ejemplo.com,12345678,1995-05-15
María García,maria.garcia@ejemplo.com,87654321,1996-08-20
```

**Validaciones:**
- Nombre Completo: Requerido, no puede estar vacío
- Email: Requerido, debe ser válido (contener @)
- DNI: Requerido, no puede estar vacío
- Fecha de Nacimiento: Opcional

**Proceso:**
1. Selecciona un archivo CSV
2. Haz clic en "Importar"
3. El sistema valida cada estudiante
4. Inserta los válidos y reporta los errores
5. Muestra el número de estudiantes importados

---

## 3. Mover Estudiante a Otro Grupo

**Ubicación:** Componente `gestionar-estudiantes.tsx` - Sección "Mover Estudiante a Otro Grupo"

**Función:** `handleMoveStudent()`

**Descripción:** Permite transferir un estudiante de un grupo a otro.

**Características:**
- Selecciona un estudiante del grupo actual
- Selecciona el grupo destino (se excluye el grupo actual)
- Actualiza automáticamente la lista después del movimiento
- Limpia las selecciones después del movimiento

**Proceso:**
1. Selecciona un estudiante de la lista desplegable
2. Selecciona el grupo destino
3. Haz clic en "Mover Estudiante"
4. El estudiante se transfiere inmediatamente
5. La lista se actualiza automáticamente

---

## Archivos Modificados

### `lib/student-utils.ts` (NUEVO)
- `exportStudentsToCSV()` - Exporta estudiantes a CSV
- `parseStudentsFromCSV()` - Parsea CSV y retorna array de estudiantes
- `validateStudentData()` - Valida datos del estudiante

### `components/groups/gestionar-estudiantes.tsx` (MODIFICADO)
- Nuevas importaciones: `Select`, `Download`, `Upload`, `ArrowRight` iconos
- Nuevas importaciones: funciones del `student-utils.ts`
- Nuevos estados: `allGroups`, `importFile`, `importLoading`, `selectedStudentForMove`, `targetGroupForMove`, `moveLoading`
- Nueva función: `loadAllGroups()`
- Nueva función: `handleExportStudents()`
- Nueva función: `handleImportStudents()`
- Nueva función: `handleMoveStudent()`
- Interfaz actualizada con 3 nuevas tarjetas (Cards) para las funcionalidades

---

## Archivo de Ejemplo

Se incluye `scripts/ejemplo-importar-estudiantes.csv` con datos de ejemplo para probar la funcionalidad de importación.

---

## Notas Técnicas

- Todas las operaciones son asincrónicas
- Los errores se muestran en un Alert rojo
- Los éxitos se muestran en un Alert verde
- La validación previene duplicados por DNI dentro del grupo
- El CSV usa comillas para escapar valores con comas
- Las fechas se formatean según la configuración de Argentina (es-AR)

