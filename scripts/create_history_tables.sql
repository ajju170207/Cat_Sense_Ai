-- =============================================
-- CatSense AI — Database Schema Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yaitlfddxpfkwyfvbxmx/sql/new
-- =============================================

-- 1. Analysis History (Audio Emotion Predictions)
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion     TEXT NOT NULL,
  confidence  REAL NOT NULL DEFAULT 0,
  audio_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analysis history"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis history"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analysis_history_user
  ON public.analysis_history(user_id, created_at DESC);


-- 2. Cat Health History (Auto-inferred from Audio + Manual entries)
CREATE TABLE IF NOT EXISTS public.cat_health_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  health_status  TEXT NOT NULL,
  notes          TEXT,
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cat_health_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own health history"
  ON public.cat_health_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health history"
  ON public.cat_health_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cat_health_history_user
  ON public.cat_health_history(user_id, recorded_at DESC);


-- 3. Disease History (Skin Disease Image Predictions)
CREATE TABLE IF NOT EXISTS public.disease_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disease           TEXT NOT NULL,
  confidence        REAL NOT NULL DEFAULT 0,
  confidence_scores JSONB,
  image_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.disease_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own disease history"
  ON public.disease_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease history"
  ON public.disease_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_disease_history_user
  ON public.disease_history(user_id, created_at DESC);
