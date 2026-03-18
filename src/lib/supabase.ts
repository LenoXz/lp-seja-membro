import { createClient } from "@supabase/supabase-js";

// ============================================================
// TODO: Substitua pelos valores do seu projeto Supabase
// Encontre em: Supabase Dashboard > Settings > API
// ============================================================
// TODO: Crie um arquivo .env.local na raiz do projeto com:
//   NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
