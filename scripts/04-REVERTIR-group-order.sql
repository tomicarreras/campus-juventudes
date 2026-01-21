-- REVERSIÓN: Borrar la columna order si algo salió mal
ALTER TABLE groups DROP COLUMN IF EXISTS "order";
