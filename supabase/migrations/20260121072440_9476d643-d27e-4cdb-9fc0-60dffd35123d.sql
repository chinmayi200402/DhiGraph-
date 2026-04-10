-- Add new columns to patients table for comprehensive registration
ALTER TABLE public.patients
ADD COLUMN IF NOT EXISTS serial_no text,
ADD COLUMN IF NOT EXISTS abha_id text,
ADD COLUMN IF NOT EXISTS resident_status text,
ADD COLUMN IF NOT EXISTS socio_economic_status text,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS occupation text,
ADD COLUMN IF NOT EXISTS opd_no text,
ADD COLUMN IF NOT EXISTS ipd_no text,
ADD COLUMN IF NOT EXISTS chief_complaint text,
ADD COLUMN IF NOT EXISTS registration_date date DEFAULT CURRENT_DATE;

-- Add unique constraint for ABHA ID (it's a key identifier)
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_abha_id ON public.patients(abha_id) WHERE abha_id IS NOT NULL AND abha_id != '';