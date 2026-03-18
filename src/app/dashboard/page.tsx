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
  "missoes-internacionais": "Missões Internacionais",
  "parceiro-empregabilidade": "Parceiro Empregabilidade",
};

const FORM_COLORS: Record<string, string> = {
  membership: "#00e846",
  "espaco-fisico": "#3b82f6",
  "programas-aceleracao": "#f59e0b",
  "missoes-internacionais": "#8b5cf6",
  "parceiro-empregabilidade": "#ec4899",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
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

  // Carrega leads e inicia Realtime (só após autenticação)
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

    fetchLeads();

    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
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

        {/* Stats */}
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
          </button>
          {Object.entries(FORM_LABELS).map(([key, label]) => {
            const color = FORM_COLORS[key];
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isActive
                    ? "bg-opacity-10"
                    : "border-white/10 bg-zinc-900 hover:border-white/20"
                }`}
                style={isActive ? { borderColor: color, backgroundColor: color + "15" } : {}}
              >
                <p className="text-2xl font-bold">{formCounts[key] ?? 0}</p>
                <p className="truncate text-xs text-zinc-400">{label}</p>
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
