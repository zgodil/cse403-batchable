-- Add finished flag to Batch for existing DBs created before this column existed.
-- New installs get it from 001_init.sql; this migration updates existing volumes.
ALTER TABLE Batch ADD COLUMN IF NOT EXISTS finished BOOLEAN NOT NULL DEFAULT false;
