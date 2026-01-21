-- Agregar columnas 'days' (días de la semana) y 'year' (año de creación) a la tabla groups
ALTER TABLE groups ADD COLUMN IF NOT EXISTS "days" VARCHAR(255);
ALTER TABLE groups ADD COLUMN IF NOT EXISTS "year" INTEGER DEFAULT EXTRACT(YEAR FROM NOW());

-- Actualizar el year para grupos existentes
UPDATE groups SET "year" = EXTRACT(YEAR FROM created_at) WHERE "year" IS NULL;
