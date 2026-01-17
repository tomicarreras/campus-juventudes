# INSTRUCCIONES DE DEPLOY Y CONFIGURACIÓN

## 🚀 Antes de Deployar

### Checklist Previo
- [ ] Todas las funciones están en `lib/student-utils.ts`
- [ ] El componente `gestionar-estudiantes.tsx` importa las funciones
- [ ] No hay errores de compilación TypeScript
- [ ] Supabase está configurado y conectado
- [ ] La tabla `students` existe en Supabase
- [ ] La tabla `groups` existe en Supabase

---

## 📦 Dependencias Requeridas

No se agregó **ninguna dependencia nueva**. Usa las existentes:

```json
{
  "dependencies": {
    "next": "^14.x.x",
    "react": "^18.x.x",
    "@supabase/supabase-js": "^2.x.x",
    "lucide-react": "^0.x.x",  // Para iconos
    "tailwindcss": "^3.x.x",
    // ... otras existentes
  }
}
```

### Verificar que existan:
```bash
npm list @supabase/supabase-js
npm list lucide-react
npm list tailwindcss
```

---

## 🔧 Instalación / Actualización

### Opción 1: Sin instalar (recomendado)
Solo copiar archivos - sin cambios en `package.json`

```bash
# No requiere instalación de paquetes
```

### Opción 2: Si hubo cambios en dependencias
```bash
npm install
# o
pnpm install
# o
yarn install
```

---

## ✅ Validar que Funciona

### 1. Compilación
```bash
npm run build
# Verificar que no haya errores de TypeScript
```

### 2. Desarrollo Local
```bash
npm run dev
# Acceder a http://localhost:3000
```

### 3. Prueba Rápida
1. Abre un grupo en "Gestionar Estudiantes"
2. Verifica que aparezcan las 3 nuevas secciones:
   - Exportar Estudiantes
   - Importar Estudiantes
   - Mover Estudiante a Otro Grupo
3. Prueba cada función

---

## 🐛 Solución de Problemas

### Problema: "Module not found: student-utils"
**Causa:** Ruta de importación incorrecta
**Solución:**
```typescript
// INCORRECTO
import { exportStudentsToCSV } from "@/student-utils"

// CORRECTO
import { exportStudentsToCSV } from "@/lib/student-utils"
```

### Problema: "CSV export no funciona"
**Causa:** El navegador puede estar bloqueando descargas
**Solución:**
- Verificar console del navegador (F12)
- Permitir popups en el navegador
- Usar un navegador moderno

### Problema: "Importación no inserta estudiantes"
**Causa:** Error de Supabase o validación
**Solución:**
- Verificar que el CSV está bien formado
- Ver console para errores específicos
- Verificar que Supabase está conectado
- Verificar que la tabla `students` existe

### Problema: "Select component no funciona"
**Causa:** Componente `Select` de shadcn/ui no instalado
**Solución:**
```bash
# Instalar el componente
npx shadcn-ui@latest add select
```

---

## 📊 Estructura de Archivos Post-Deploy

```
attendance/
├── lib/
│   ├── student-utils.ts          ✨ NUEVO
│   ├── actions.ts
│   ├── auth.ts
│   ├── types.ts
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── components/
│   ├── groups/
│   │   ├── gestionar-estudiantes.tsx  ✏️ MODIFICADO
│   │   ├── crear-grupo-form.tsx
│   │   ├── editar-grupo-form.tsx
│   │   ├── lista-grupos.tsx
│   │   └── ...
│   └── ...
├── scripts/
│   ├── ejemplo-importar-estudiantes.csv
│   ├── 01-create-tables.sql
│   └── 02-seed-sample-data.sql
├── RESUMEN_CAMBIOS.md            ✨ DOCUMENTACIÓN
├── GUIA_RAPIDA.md
├── FUNCIONALIDADES_NUEVAS.md
├── DIAGRAMA_FLUJOS.md
├── API_REFERENCIA.md
└── GUIA_TESTING.md
```

---

## 🌐 Desplegar en Producción

### Opción 1: Vercel (Recomendado)
```bash
# 1. Conectar repositorio
vercel link

# 2. Deployar
vercel deploy --prod

# 3. Verificar en https://[proyecto].vercel.app
```

### Opción 2: Netlify
```bash
# 1. Conectar repositorio
netlify connect

# 2. Deployar
npm run build
netlify deploy --prod --dir=.next
```

### Opción 3: Servidor Propio (Node.js)
```bash
# 1. Compilar
npm run build

# 2. Iniciar
npm run start
```

### Opción 4: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔐 Variables de Entorno

Asegúrate de que existen en producción:
```
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-clave-anon]
```

**Verificar en:**
- `.env.local` (desarrollo)
- Dashboard del hosting (producción)
- Variables secretas del repositorio

---

## 📈 Monitoreo Post-Deploy

### Verificar que funciona:
1. [ ] Exportar CSV funciona
2. [ ] Importar CSV funciona
3. [ ] Mover estudiante funciona
4. [ ] No hay errores en Console
5. [ ] No hay errores en Network
6. [ ] Performance es aceptable

### Logs en Supabase:
```
Dashboard → Logs → Edge Functions (si aplica)
```

### Logs en Vercel/Netlify:
```
Dashboard → Deployments → Logs
```

---

## 🔄 Rollback en Caso de Error

### Si algo sale mal:
```bash
# 1. Revertir commits
git revert <commit-hash>

# 2. Recompilar
npm run build

# 3. Redespleguar
vercel deploy --prod
# O el comando de tu hosting
```

---

## ✨ Optimizaciones Recomendadas

### Para mejor performance en importación:
```typescript
// En gestionar-estudiantes.tsx
// Agregar debounce al input de búsqueda de estudiantes
import { useDebouncedValue } from "@mantine/hooks"
```

### Para mejor UX:
```typescript
// Mostrar progreso de importación
const [importProgress, setImportProgress] = useState(0)
```

### Para mejor SEO (si aplica):
```typescript
// Agregar metadata en `app/dashboard/page.tsx`
export const metadata = {
  title: 'Gestionar Estudiantes - Campus Juventudes',
}
```

---

## 📞 Soporte Post-Deploy

### Si encuentras problemas:

1. **Revisar Console del Navegador** (F12)
2. **Verificar Supabase Dashboard**
3. **Revisar Logs de Deployment**
4. **Probar en Incógnito/Private Mode**
5. **Intentar con archivo de ejemplo**

### Información útil a reportar:
- Navegador y versión
- Sistema operativo
- URL exacta donde ocurre el error
- Paso específico que falla
- Pantalla del error (screenshot)
- Mensajes de console

---

## 🎯 Conclusión

✅ Implementación completada
✅ Funcionalidades integradas
✅ Documentación incluida
✅ Listo para producción

**Próximos pasos:**
1. Ejecutar `npm run build`
2. Probar localmente con `npm run dev`
3. Deployar a producción
4. Realizar testing final

