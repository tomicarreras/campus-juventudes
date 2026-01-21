-- Agregar columna order a groups para permitir reordenamiento
ALTER TABLE groups ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Actualizar orden existente basado en created_at (usando CTE porque window functions no funcionan directamente en UPDATE)
WITH ordered_groups AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY teacher_id ORDER BY created_at ASC) - 1 AS new_order
  FROM groups
)
UPDATE groups
SET "order" = ordered_groups.new_order
FROM ordered_groups
WHERE groups.id = ordered_groups.id;
