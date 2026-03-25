"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Lead {
  id: string;
  created_at: string;
  form_name: string;
  nome: string;
  email: string;
  telefone: string;
  custom_data: Record<string, unknown>;
}

const FORM_LABELS: Record<string, string> = {
  membership: "Membership",
  "espaco-fisico": "Espaço Físico",
  "programas-aceleracao": "Programas de Aceleração",
  "geracao-caldeira": "Geração Caldeira",
  "missoes-internacionais": "Missões Internacionais",
  "parceiro-empregabilidade": "Parceiro Empregabilidade",
};

const FORM_COLORS: Record<string, string> = {
  membership: "#00e846",
  "espaco-fisico": "#3b82f6",
  "programas-aceleracao": "#f59e0b",
  "geracao-caldeira": "#06b6d4",
  "missoes-internacionais": "#8b5cf6",
  "parceiro-empregabilidade": "#ec4899",
};

// ---------------------------------------------------------------------------
// Sub-KPI: Membership por tipo de empresa
// ---------------------------------------------------------------------------

function getMembershipTypeCounts(leads: Lead[]) {
  const membershipLeads = leads.filter((l) => l.form_name === "membership");
  const counts: Record<string, number> = {};
  for (const lead of membershipLeads) {
    const tipo = String(lead.custom_data?.tipo_empresa ?? "Não informado");
    counts[tipo] = (counts[tipo] ?? 0) + 1;
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Sub-KPI: Programas de Aceleração por estágio do negócio
// ---------------------------------------------------------------------------

const ESTAGIO_SHORT: Record<string, string> = {
  "Ideação: Refinando a ideia do negócio ou conceito.": "Ideação",
  "Validação: Produto em validação, mas ainda sem vendas.": "Validação",
  "Operação: Produto lançado no mercado, em fase inicial de vendas.": "Operação",
  "Tração: Expansão ativa e aumento consistente de clientes/receita.": "Tração",
  "Escala: Estabelecida no mercado, buscando expansão e otimização.": "Escala",
};

function getAceleracaoEstagioCounts(leads: Lead[]) {
  const aceleracaoLeads = leads.filter((l) => l.form_name === "programas-aceleracao");
  const counts: Record<string, number> = {};
  for (const lead of aceleracaoLeads) {
    const raw = String(lead.custom_data?.estagio_negocio ?? "Não informado");
    const label = ESTAGIO_SHORT[raw] ?? raw;
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Sub-KPI pills component
// ---------------------------------------------------------------------------

function SubKpis({ counts, color }: { counts: Record<string, number>; color: string }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {entries.map(([label, count]) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: color + "15", color }}
        >
          {count} {label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lead Card
// ---------------------------------------------------------------------------

function LeadCard({ lead, isNew }: { lead: Lead; isNew: boolean }) {
  const color = FORM_COLORS[lead.form_name] ?? "#00e846";
  const customEntries = Object.entries(lead.custom_data || {});

  return (
    <div
      className={`rounded-lg border border-white/10 bg-zinc-900 p-5 transition-all duration-500 ${
        isNew ? "animate-pulse ring-2 ring-green-400" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold uppercase"
          style={{ backgroundColor: color + "20", color }}
        >
          {FORM_LABELS[lead.form_name] ?? lead.form_name}
        </span>
        <span className="text-xs text-zinc-500">{formatDate(lead.created_at)}</span>
      </div>

      <h3 className="mb-1 text-lg font-bold text-white">{lead.nome}</h3>
      <p className="text-sm text-zinc-400">{lead.email}</p>
      <p className="mb-3 text-sm text-zinc-400">{lead.telefone}</p>

      {customEntries.length > 0 && (
        <div className="border-t border-white/5 pt-3">
          {customEntries.map(([key, value]) => (
            <div key={key} className="mb-1 flex gap-2 text-sm">
              <span className="text-zinc-500">{key.replace(/_/g, " ")}:</span>
              <span className="text-zinc-300">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [pageViews, setPageViews] = useState(0);
  const [todayPageViews, setTodayPageViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [geracaoClicks, setGeracaoClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  // Verifica autenticação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/dashboard/login");
        return;
      }
      setAuthChecking(false);
    });
  }, [router]);

  // Carrega leads, page views e inicia Realtime
  useEffect(() => {
    if (authChecking) return;

    async function fetchLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Erro ao buscar leads:", error);
      } else {
        setLeads(data as Lead[]);
      }
      setLoading(false);
    }

    async function fetchPageViews() {
      // Total de acessos (exclui cliques de botão)
      const { count: total } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .not("page", "like", "click:%");
      setPageViews(total ?? 0);

      // Acessos de hoje (exclui cliques de botão)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count: today } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString())
        .not("page", "like", "click:%");
      setTodayPageViews(today ?? 0);

      // Visitantes únicos (distinct visitor_id)
      const { data: visitorData } = await supabase
        .from("page_views")
        .select("visitor_id")
        .not("visitor_id", "is", null);

      if (visitorData) {
        const uniqueIds = new Set(visitorData.map((row) => row.visitor_id));
        setUniqueVisitors(uniqueIds.size);
      }
    }

    async function fetchGeracaoClicks() {
      const { count } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("page", "click:geracao-caldeira");
      setGeracaoClicks(count ?? 0);
    }

    fetchLeads();
    fetchPageViews();
    fetchGeracaoClicks();

    const leadsChannel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads((prev) => [newLead, ...prev]);
          setNewIds((prev) => new Set(prev).add(newLead.id));

          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              next.delete(newLead.id);
              return next;
            });
          }, 3000);
        }
      )
      .subscribe();

    const viewsChannel = supabase
      .channel("views-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "page_views" },
        (payload) => {
          const newRow = payload.new as { page?: string; visitor_id?: string };

          // Cliques no Geração Caldeira não são page views
          if (newRow.page === "click:geracao-caldeira") {
            setGeracaoClicks((prev) => prev + 1);
            return;
          }

          setPageViews((prev) => prev + 1);
          setTodayPageViews((prev) => prev + 1);
          // Atualiza visitantes únicos em tempo real
          if (newRow.visitor_id) {
            setUniqueVisitors((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, [authChecking]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/dashboard/login");
  };

  // Tela de loading enquanto verifica auth
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
      </div>
    );
  }

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.form_name === filter);

  const formCounts = leads.reduce(
    (acc, l) => {
      acc[l.form_name] = (acc[l.form_name] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const membershipTypeCounts = getMembershipTypeCounts(leads);
  const aceleracaoEstagioCounts = getAceleracaoEstagioCounts(leads);

  const conversionRate =
    uniqueVisitors > 0 ? ((leads.length / uniqueVisitors) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Leads</h1>
            <p className="mt-1 text-zinc-400">
              Atualizado em tempo real via Supabase Realtime
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            Sair
          </button>
        </div>

        {/* Métricas principais */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div className="mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e846" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-xs font-medium uppercase text-zinc-400">Acessos hoje</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{todayPageViews}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div className="mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-xs font-medium uppercase text-zinc-400">Acessos total</span>
            </div>
            <p className="text-2xl font-bold">{pageViews}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div className="mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e846" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs font-medium uppercase text-zinc-400">Visitantes únicos</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{uniqueVisitors}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div className="mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="text-xs font-medium uppercase text-zinc-400">Conversão</span>
            </div>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </div>
        </div>

        {/* Geração Caldeira clicks */}
        <div className="mb-6 grid grid-cols-1">
          <div className="rounded-lg border p-4" style={{ borderColor: "#06b6d4", backgroundColor: "#06b6d415" }}>
            <div className="mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              <span className="text-xs font-medium uppercase text-zinc-400">Cliques — Inscreva-se Geração Caldeira</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#06b6d4" }}>{geracaoClicks}</p>
          </div>
        </div>

        {/* KPI Cards por produto (filtro) */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg border p-4 text-left transition-colors ${
              filter === "all"
                ? "border-green-400 bg-green-400/10"
                : "border-white/10 bg-zinc-900 hover:border-white/20"
            }`}
          >
            <p className="text-2xl font-bold">{leads.length}</p>
            <p className="text-xs text-zinc-400">Total</p>
            <p className="text-[10px] text-zinc-500">Total leads</p>
          </button>
          {Object.entries(FORM_LABELS).filter(([key]) => key !== "geracao-caldeira").map(([key, label]) => {
            const color = FORM_COLORS[key];
            const isActive = filter === key;
            const count = formCounts[key] ?? 0;

            // Sub-KPIs
            let subCounts: Record<string, number> | null = null;
            if (key === "membership" && count > 0) subCounts = membershipTypeCounts;
            if (key === "programas-aceleracao" && count > 0) subCounts = aceleracaoEstagioCounts;

            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isActive
                    ? "bg-opacity-10"
                    : "border-white/10 bg-zinc-900 hover:border-white/20"
                } ${subCounts ? "col-span-2 md:col-span-1" : ""}`}
                style={isActive ? { borderColor: color, backgroundColor: color + "15" } : {}}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="truncate text-xs text-zinc-400">{label}</p>
                {subCounts && <SubKpis counts={subCounts} color={color} />}
              </button>
            );
          })}
        </div>

        {/* Leads Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <p className="text-lg">Nenhum lead ainda</p>
            <p className="text-sm">Novos leads aparecerão aqui em tempo real</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} isNew={newIds.has(lead.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
