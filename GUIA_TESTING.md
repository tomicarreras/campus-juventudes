# GUÍA DE TESTING

## 🧪 Pruebas Recomendadas

### ANTES DE EMPEZAR
- Asegúrate de tener conectividad con Supabase
- Verifica que tengas al menos 1 grupo creado
- Ten un CSV de prueba listo

---

## TEST 1: EXPORTAR ESTUDIANTES

### Precondiciones:
✓ Un grupo con estudiantes
✓ Acceso a Gestionar Estudiantes

### Pasos:
1. Abre "Gestionar Estudiantes" de un grupo
2. Desplázate a "Exportar Estudiantes"
3. Haz clic en "Descargar CSV"

### Resultados Esperados:
✅ Se descarga un archivo .csv
✅ Nombre: `estudiantes_[nombre_grupo]_YYYY-MM-DD.csv`
✅ Contiene:
   - Encabezados correctos
   - Todos los estudiantes del grupo
   - Fechas en formato DD/MM/YYYY
   - Datos correctos

### Pruebas Adicionales:
- [ ] Con 1 estudiante
- [ ] Con 10 estudiantes
- [ ] Con estudiantes sin fecha de nacimiento
- [ ] Con nombres especiales (tildes, caracteres)

---

## TEST 2: IMPORTAR ESTUDIANTES

### Precondiciones:
✓ Archivo CSV válido
✓ Formato correcto

### Pasos:
1. Abre "Gestionar Estudiantes"
2. Ve a "Importar Estudiantes"
3. Selecciona el archivo `ejemplo-importar-estudiantes.csv`
4. Haz clic en "Importar"

### Resultados Esperados:
✅ Aparece mensaje: "Se importaron 3 estudiante(s) exitosamente"
✅ Los 3 estudiantes aparecen en la lista
✅ Los datos son correctos

### Casos de Prueba:

#### 2.1: Importación Normal
- **Archivo:** CSV válido con 5 estudiantes
- **Esperado:** Todos importados
- [ ] PASS

#### 2.2: Importación con Duplicados
- **Archivo:** CSV con DNI duplicado en grupo
- **Esperado:** Se omite duplicado, mensaje de omitidos
- [ ] PASS

#### 2.3: Importación con Errores
- **Archivo:** CSV con email inválido en una fila
- **Esperado:** Se importan los válidos, se omite el inválido
- [ ] PASS

#### 2.4: CSV Vacío
- **Archivo:** Solo encabezados
- **Esperado:** Error: "archivo está vacío"
- [ ] PASS

#### 2.5: CSV Sin Encabezados
- **Archivo:** Faltan columnas requeridas
- **Esperado:** Error: "faltan datos"
- [ ] PASS

#### 2.6: Datos Incompletos
- **Archivo:** Falta Email en una fila
- **Esperado:** Se omite esa fila, se importan otras
- [ ] PASS

### Validaciones Específicas:
- [ ] Email inválido (`juan@`) rechazado
- [ ] Nombre vacío rechazado
- [ ] DNI vacío rechazado
- [ ] Fecha de nacimiento opcional acepta vacío
- [ ] Caracteres especiales (ñ, á) funcionan

---

## TEST 3: MOVER ESTUDIANTE

### Precondiciones:
✓ Mínimo 2 grupos
✓ Mínimo 1 estudiante en un grupo

### Pasos:
1. Abre "Gestionar Estudiantes" de un grupo
2. Ve a "Mover Estudiante a Otro Grupo"
3. Selecciona un estudiante
4. Selecciona un grupo destino diferente
5. Haz clic en "Mover Estudiante"

### Resultados Esperados:
✅ Mensaje: "Nombre fue movido exitosamente"
✅ Estudiante desaparece de la lista original
✅ Estudiante aparece en el grupo destino
✅ Abre el grupo destino y verifica que esté ahí

### Casos de Prueba:

#### 3.1: Mover a Grupo Válido
- **Acción:** Mover a grupo diferente
- **Esperado:** Éxito, estudiante transferido
- [ ] PASS

#### 3.2: Mover a Grupo Mismo
- **Acción:** Intentar mover al mismo grupo
- **Esperado:** El grupo actual no aparece en el dropdown
- [ ] PASS

#### 3.3: Verificación Cruzada
- **Acción:** Abrir ambos grupos
- **Esperado:** Estudiante solo en grupo destino
- [ ] PASS

#### 3.4: Sin Selecciones
- **Acción:** No seleccionar nada
- **Esperado:** Botón deshabilitado
- [ ] PASS

---

## TEST 4: INTEGRACIÓN

### Escenario 1: Ciclo Completo
1. [ ] Importa 10 estudiantes
2. [ ] Exporta el grupo
3. [ ] Mueve 3 a otro grupo
4. [ ] Verifica archivo exportado en grupo 1 tiene 7
5. [ ] Verifica archivo exportado en grupo 2 tiene 3

### Escenario 2: Datos Especiales
1. [ ] Importa estudiantes con nombres largos
2. [ ] Importa estudiantes con acentos (García, López)
3. [ ] Importa estudiantes sin fecha de nacimiento
4. [ ] Exporta y verifica formato

### Escenario 3: Flujo Real
1. [ ] Crea grupo nuevo
2. [ ] Importa 50 estudiantes
3. [ ] Exporta lista de control
4. [ ] Mueve 10 a otro grupo
5. [ ] Verifica consistencia en ambos grupos

---

## TEST 5: MANEJO DE ERRORES

### Error 1: Archivo Corrupto
- **Acción:** Cargar archivo no-CSV
- **Esperado:** Error claro en importación
- [ ] PASS

### Error 2: Conexión Perdida
- **Acción:** Desconectar internet durante importación
- **Esperado:** Error de conexión mostrado
- [ ] PASS

### Error 3: Permisos
- **Acción:** Intentar en grupo sin permisos
- **Esperado:** Error de Supabase
- [ ] PASS

---

## TEST 6: PERFORMANCE

### Carga Grande
- [ ] 100 estudiantes en importación: < 5 segundos
- [ ] Exportación de 100 estudiantes: < 2 segundos
- [ ] Mover estudiante: < 1 segundo

### Memoria
- [ ] Sin memory leaks en múltiples operaciones
- [ ] UI responsive durante carga

---

## TEST 7: RESPONSIVIDAD

### Desktop
- [ ] Funciona en Chrome
- [ ] Funciona en Firefox
- [ ] Funciona en Safari
- [ ] Funciona en Edge

### Tablet
- [ ] Selects funciona bien
- [ ] Botones accesibles
- [ ] Layout correcto

### Mobile
- [ ] Interfaz adaptada
- [ ] Archivo upload funciona
- [ ] Selects desplegables funciona
- [ ] Descargas funcionan

---

## CHECKLIST FINAL

### Exportar
- [ ] Botón deshabilitado si no hay estudiantes
- [ ] Descarga archivo con nombre correcto
- [ ] CSV válido y abre en Excel/Sheets
- [ ] Datos correctos

### Importar
- [ ] Validación de email funciona
- [ ] Validación de campos requeridos funciona
- [ ] Evita duplicados
- [ ] Reporta errores claramente
- [ ] Cuenta correcta de importados

### Mover
- [ ] No permite mover a mismo grupo
- [ ] Actualiza listas correctamente
- [ ] Estudiante transferido correctamente
- [ ] Mensaje de éxito aparece

### General
- [ ] No hay errores en consola
- [ ] Interfaz responsive
- [ ] Mensajes claros
- [ ] Performance aceptable

---

## COMANDOS DE PRUEBA (Dev Tools)

```javascript
// Ver estudiantes en consola
console.table(students)

// Ver estado de importación
console.log(importLoading, importFile)

// Ver estado de movimiento
console.log(selectedStudentForMove, targetGroupForMove)
```

---

## NOTAS

- Usa archivos de prueba pequeños primero
- Verifica en Supabase que los cambios se hayan guardado
- Limpia datos de prueba después de terminar
- Reporta cualquier error con fecha y hora

