-- Migration: Add 22K and 24K Gold Rates to Settings Table
-- Shete Jewellers - Gold Rate Management Feature
--
-- Instructions:
-- Execute this SQL in the Supabase Dashboard SQL Editor for project:
-- https://supabase.com/dashboard/project/zeowquchdsbljoujlhmr/sql

-- 1. Add columns for 22K and 24K rates if they don't already exist
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS manual_rate_24k NUMERIC DEFAULT NULL;

ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS manual_rate_22k NUMERIC DEFAULT NULL;

-- 2. Populate manual_rate_22k from existing manual_rate if not already set
UPDATE settings 
SET manual_rate_22k = manual_rate 
WHERE id = 'gold_rate' AND manual_rate_22k IS NULL;

-- 3. Ensure the gold_rate row exists
INSERT INTO settings (id, manual_rate, manual_rate_22k, manual_rate_24k, use_manual, last_updated)
VALUES ('gold_rate', 15200, 15200, NULL, true, NOW())
ON CONFLICT (id) DO NOTHING;
