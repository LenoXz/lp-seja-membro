-- ============================================================
-- Tabela: leads
-- Armazena todos os leads capturados pela Landing Page.
-- Campos comuns (nome, email, telefone) são colunas dedicadas.
-- Campos específicos de cada formulário vão no JSONB custom_data.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  form_name   TEXT NOT NULL,               -- ex: "membership", "espaco-fisico"
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefone    TEXT NOT NULL,
  custom_data JSONB DEFAULT '{}'::jsonb    -- campos variáveis por formulário
);

-- Índices para consultas frequentes
CREATE INDEX idx_leads_form_name  ON public.leads (form_name);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_email      ON public.leads (email);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Permite INSERT anônimo (vindo da landing page com anon key)
CREATE POLICY "Permitir insert anônimo"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Permite SELECT apenas para usuários autenticados (dashboard)
CREATE POLICY "Permitir select para autenticados"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Tabela: page_views
-- Rastreia acessos à landing page com fingerprint de visitante.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  page        TEXT,
  referrer    TEXT,
  user_agent  TEXT,
  visitor_id  TEXT                         -- fingerprint único do navegador
);

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_visitor_id ON public.page_views (visitor_id);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Permite INSERT anônimo (vindo do PageTracker)
CREATE POLICY "Permitir insert anônimo"
  ON public.page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Permite SELECT apenas para usuários autenticados (dashboard)
CREATE POLICY "Permitir select para autenticados"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Realtime: habilitar publicação para as tabelas
-- (Necessário para o dashboard em tempo real)
-- ============================================================
-- No Supabase Dashboard: Database > Replication > adicione as tabelas
-- Ou via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
