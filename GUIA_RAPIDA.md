# Guía Rápida - Nuevas Funcionalidades

## 🚀 ¿Dónde encontrar las nuevas funciones?

Todas las nuevas funcionalidades están en el módulo **"Gestionar Estudiantes"** de cada grupo.

---

## 📥 1. IMPORTAR ESTUDIANTES MASIVAMENTE

### Pasos:
1. Abre un grupo desde "Gestionar Estudiantes"
2. Ve a la sección **"Importar Estudiantes"**
3. Haz clic en "Seleccionar archivo" y elige un CSV
4. El archivo debe tener este formato:

```
Nombre Completo,Email,DNI,Fecha de Nacimiento
Juan Pérez,juan@ejemplo.com,12345678,1995-05-15
María García,maria@ejemplo.com,87654321,1996-08-20
```

5. Haz clic en **"Importar"**
6. Recibirás un mensaje indicando cuántos se importaron exitosamente

### Características importantes:
- ✅ Valida cada estudiante antes de importar
- ✅ Evita duplicados (no importa si el DNI ya existe)
- ✅ Puedes ver qué falló en la importación
- ✅ La Fecha de Nacimiento es opcional

---

## 📤 2. EXPORTAR ESTUDIANTES A CSV

### Pasos:
1. Abre un grupo desde "Gestionar Estudiantes"
2. Ve a la sección **"Exportar Estudiantes"**
3. Haz clic en **"Descargar CSV"**
4. Se descargará automáticamente un archivo llamado:
   `estudiantes_NombreDelGrupo_YYYY-MM-DD.csv`

### El archivo incluye:
- Nombre Completo
- Email
- DNI
- Fecha de Nacimiento (si existe)

---

## 🔄 3. MOVER UN ESTUDIANTE A OTRO GRUPO

### Pasos:
1. Abre un grupo desde "Gestionar Estudiantes"
2. Ve a la sección **"Mover Estudiante a Otro Grupo"**
3. Selecciona el estudiante que quieres mover
4. Selecciona el grupo destino
5. Haz clic en **"Mover Estudiante"**
6. ¡Listo! El estudiante ahora está en el otro grupo

### Notas:
- Solo puedes mover a grupos diferentes al actual
- El estudiante se transfiere completamente
- Todos sus registros de asistencia también se transfieren

---

## 💡 Casos de Uso Comunes

### Caso 1: Tengo una lista de 50 estudiantes en Excel
1. Guarda el Excel como CSV
2. Asegúrate de que tiene: Nombre, Email, DNI, Fecha de Nacimiento (opcional)
3. Usa la función de **Importar Estudiantes**
4. ¡En segundos estarán todos cargados!

### Caso 2: Necesito respaldar los datos de un grupo
1. Usa **Exportar Estudiantes**
2. Se descargará el CSV automáticamente
3. Guárdalo en tu computadora

### Caso 3: Un estudiante se equivocó de grupo
1. Usa **Mover Estudiante a Otro Grupo**
2. Selecciona al estudiante y el grupo correcto
3. ¡Listo!

---

## ⚠️ Validaciones

El sistema valida automáticamente:
- ✓ Nombre no vacío
- ✓ Email válido (contiene @)
- ✓ DNI no vacío
- ✓ No importa estudiantes duplicados (mismo DNI en el mismo grupo)

Si algo no es válido, se muestra un mensaje de error específico.

---

## 📝 Formato CSV Correcto

**CORRECTO:**
```
Nombre Completo,Email,DNI,Fecha de Nacimiento
"García, Juan",juan@mail.com,12345678,1995-05-15
"López Martínez, María",maria@mail.com,87654321,1996-08-20
```

**INCORRECTO:**
```
Nombre,Email,DNI
Juan,juan@mail.com,12345678
```
(Faltan las columnas correctas)

---

## 🔧 Archivos Técnicos

- Funciones: `lib/student-utils.ts`
- Componente: `components/groups/gestionar-estudiantes.tsx`
- Ejemplo CSV: `scripts/ejemplo-importar-estudiantes.csv`

