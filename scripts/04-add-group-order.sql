-- Agregar columna order a groups para permitir reordenamiento
ALTER TABLE groups ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Actualizar orden existente basado en created_at
UPDATE groups 
SET "order" = ROW_NUMBER() OVER (PARTITION BY teacher_id ORDER BY created_at ASC) - 1
WHERE "order" = 0;
