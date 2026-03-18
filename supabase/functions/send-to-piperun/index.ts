import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const PIPERUN_TOKEN = Deno.env.get("PIPERUN_TOKEN");
const PIPERUN_API_URL = "https://api.pipe.run/v1";
const ORIGIN_ID = 764553;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeadPayload {
  id: string;
  created_at: string;
  form_name: string;
  nome: string;
  email: string;
  telefone: string;
  custom_data: Record<string, string> | string;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: LeadPayload;
  schema: string;
}

// ---------------------------------------------------------------------------
// Helpers: garante que custom_data seja sempre um objeto
// ---------------------------------------------------------------------------

function parseCustomData(raw: Record<string, string> | string | null | undefined): Record<string, string> {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      console.error("[parseCustomData] Falha ao parsear custom_data string:", raw);
      return {};
    }
  }
  return raw;
}

interface CustomField {
  id: number;
  value: string;
}

// ---------------------------------------------------------------------------
// Mapeamentos
// ---------------------------------------------------------------------------

const PIPELINE_MAP: Record<string, { pipeline_id: number; stage_id: number }> = {
  "membership":                 { pipeline_id: 54944,  stage_id: 327552 },
  "espaco-fisico":              { pipeline_id: 101757, stage_id: 654313 },
  "programas-aceleracao":       { pipeline_id: 103100, stage_id: 664077 },
  "missoes-internacionais":     { pipeline_id: 73249,  stage_id: 449372 },
  "parceiro-empregabilidade":   { pipeline_id: 103101, stage_id: 664079 },
};

const SEGMENT_MAP: Record<string, number> = {
  "Institucional, Poder Público & ONG": 245664,
  "Construção, Engenharia & Incorp.": 245657,
  "Marketing, Entretenimento & Lazer": 245660,
  "Jurídico & Prestação de Serviços": 245661,
  "Agronegócios": 245658,
  "Comércio & Varejo": 245652,
  "Tecnologia & Hardware": 245662,
  "Energia e Sustentabilidade": 245655,
  "Tecnologia & Software": 245663,
  "Indústria & Manufatura": 245651,
  "Educação e Recursos Humanos": 245654,
  "Saúde & Farmacía": 245653,
  "Finanças, Pagamentos e Investimentos": 245650,
  "Transporte, Logística & Mobilidade": 245656,
};

const COMPANY_NAME_FIELD: Record<string, string> = {
  "membership": "empresa",
  "espaco-fisico": "empresa",
  "programas-aceleracao": "nome_startup",
  "missoes-internacionais": "empresa",
  "parceiro-empregabilidade": "empresa",
};

// ---------------------------------------------------------------------------
// Configuração de campos customizados por formulário
// ---------------------------------------------------------------------------

interface FormFieldMapping {
  company_custom_fields: Record<string, number>;
  person_custom_fields: Record<string, number>;
  deal_custom_fields: Record<string, number>;
  segment_field?: string;
}

const FORM_FIELDS: Record<string, FormFieldMapping> = {
  "membership": {
    company_custom_fields: {
      "num_funcionarios": 464592,
      "tipo_empresa": 496827,
    },
    person_custom_fields: {
      "cargo": 694927,
    },
    deal_custom_fields: {},
    segment_field: "segmento",
  },
  "espaco-fisico": {
    company_custom_fields: {
      "modelo_trabalho": 463698,
    },
    person_custom_fields: {},
    deal_custom_fields: {
      "m2_desejados": 675173,
      "espaco_sede": 764147,
      "times_hub": 764208,
      "num_pessoas": 764172,
      "urgencia": 764168,
    },
  },
  "programas-aceleracao": {
    company_custom_fields: {
      "pitch": 463686,
    },
    person_custom_fields: {},
    deal_custom_fields: {
      "setor": 764182,
      "estagio_negocio": 549764,
      "rodada_captacao": 764186,
      "total_captado": 764187,
    },
  },
  "missoes-internacionais": {
    company_custom_fields: {},
    person_custom_fields: {},
    deal_custom_fields: {},
  },
  "parceiro-empregabilidade": {
    company_custom_fields: {},
    person_custom_fields: {},
    deal_custom_fields: {
      "possui_vagas": 764188,
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const apiHeaders = () => ({
  "Token": PIPERUN_TOKEN!,
  "Content-Type": "application/json",
});

function buildCustomFields(
  data: Record<string, string>,
  mapping: Record<string, number>,
): CustomField[] {
  const fields: CustomField[] = [];
  for (const [dataKey, piperunId] of Object.entries(mapping)) {
    const value = data[dataKey];
    if (value !== undefined && value !== "") {
      fields.push({ id: piperunId, value: String(value) });
    }
  }
  return fields;
}

async function piperunFetch(
  label: string,
  url: string,
  options?: RequestInit,
): Promise<Record<string, unknown>> {
  const method = options?.method ?? "GET";
  console.log(`[${label}] ${method} ${url}`);
  if (options?.body) {
    console.log(`[${label}] Body:`, options.body);
  }

  const res = await fetch(url, options);
  const text = await res.text();

  if (!res.ok) {
    console.error(`[${label}] ERRO ${res.status}:`, text);
    throw new Error(`${label} failed: ${res.status} - ${text}`);
  }

  const json = JSON.parse(text);
  console.log(`[${label}] OK - Response ID:`, JSON.stringify(json.data?.id ?? json.data?.[0]?.id ?? "sem id"));
  return json;
}

// ---------------------------------------------------------------------------
// API: Company — busca, cria ou atualiza
// ---------------------------------------------------------------------------

async function findOrCreateCompany(
  companyName: string,
  customData: Record<string, string>,
  formMapping: FormFieldMapping,
): Promise<number> {
  // Busca empresa pelo nome
  const searchData = await piperunFetch(
    "Company/Search",
    `${PIPERUN_API_URL}/companies?name=${encodeURIComponent(companyName)}`,
    { headers: { "Token": PIPERUN_TOKEN! } },
  );

  // Monta custom fields e segment
  const companyCustom = buildCustomFields(customData, formMapping.company_custom_fields);
  let segmentId: number | undefined;
  if (formMapping.segment_field) {
    const segmentValue = customData[formMapping.segment_field];
    segmentId = segmentValue ? SEGMENT_MAP[segmentValue] : undefined;
    console.log(`[Company] Segmento: "${segmentValue}" → segment_id: ${segmentId ?? "NÃO ENCONTRADO"}`);
  }

  // Se empresa já existe, atualiza os custom fields
  if (Array.isArray(searchData.data) && searchData.data.length > 0) {
    const existingId = searchData.data[0].id as number;
    console.log(`[Company] Encontrada: id=${existingId}, atualizando campos...`);

    const updateBody: Record<string, unknown> = {};
    if (segmentId) {
      updateBody.segment_id = segmentId;
    }
    if (companyCustom.length > 0) {
      updateBody.custom_fields = companyCustom;
    }

    if (Object.keys(updateBody).length > 0) {
      await piperunFetch(
        "Company/Update",
        `${PIPERUN_API_URL}/companies/${existingId}`,
        {
          method: "PUT",
          headers: apiHeaders(),
          body: JSON.stringify(updateBody),
        },
      );
    }

    return existingId;
  }

  // Cria empresa nova
  const body: Record<string, unknown> = {
    name: companyName,
  };
  if (segmentId) {
    body.segment_id = segmentId;
  }
  if (companyCustom.length > 0) {
    body.custom_fields = companyCustom;
  }

  console.log(`[Company] Criando empresa: "${companyName}"`, JSON.stringify(body));

  const createData = await piperunFetch(
    "Company/Create",
    `${PIPERUN_API_URL}/companies`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(body),
    },
  );

  const companyId = (createData.data as Record<string, unknown>).id as number;
  console.log(`[Company] Criada: id=${companyId}`);
  return companyId;
}

// ---------------------------------------------------------------------------
// API: Person — busca, cria ou atualiza
// ---------------------------------------------------------------------------

async function findOrCreatePerson(
  lead: LeadPayload,
  companyId: number,
  customData: Record<string, string>,
  formMapping: FormFieldMapping,
): Promise<number> {
  const searchData = await piperunFetch(
    "Person/Search",
    `${PIPERUN_API_URL}/persons?email=${encodeURIComponent(lead.email)}`,
    { headers: { "Token": PIPERUN_TOKEN! } },
  );

  const personCustom = buildCustomFields(customData, formMapping.person_custom_fields);

  // Se pessoa já existe, atualiza todos os dados
  if (Array.isArray(searchData.data) && searchData.data.length > 0) {
    const existingId = searchData.data[0].id as number;
    console.log(`[Person] Encontrada: id=${existingId}, atualizando campos...`);

    const updateBody: Record<string, unknown> = {
      name: lead.nome,
      contactEmails: [lead.email],
      contactPhones: [lead.telefone],
      company_id: companyId,
    };
    if (personCustom.length > 0) {
      updateBody.custom_fields = personCustom;
    }

    await piperunFetch(
      "Person/Update",
      `${PIPERUN_API_URL}/persons/${existingId}`,
      {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify(updateBody),
      },
    );

    return existingId;
  }

  // Cria pessoa nova
  const body: Record<string, unknown> = {
    name: lead.nome,
    contactEmails: [lead.email],
    contactPhones: [lead.telefone],
    company_id: companyId,
  };
  if (personCustom.length > 0) {
    body.custom_fields = personCustom;
  }

  console.log(`[Person] Criando pessoa: "${lead.nome}"`, JSON.stringify(body));

  const createData = await piperunFetch(
    "Person/Create",
    `${PIPERUN_API_URL}/persons`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(body),
    },
  );

  const personId = (createData.data as Record<string, unknown>).id as number;
  console.log(`[Person] Criada: id=${personId}`);
  return personId;
}

// ---------------------------------------------------------------------------
// API: Deal
// ---------------------------------------------------------------------------

async function createDeal(
  lead: LeadPayload,
  personId: number,
  companyId: number,
  companyName: string,
  customData: Record<string, string>,
  formMapping: FormFieldMapping,
) {
  const pipeline = PIPELINE_MAP[lead.form_name] ?? PIPELINE_MAP["membership"];

  const title = `${companyName} - SSB26 (${lead.id.slice(0, 8)})`;

  const body: Record<string, unknown> = {
    title,
    pipeline_id: pipeline.pipeline_id,
    stage_id: pipeline.stage_id,
    person_id: personId,
    company_id: companyId,
    origin_id: ORIGIN_ID,
  };

  const dealCustom = buildCustomFields(customData, formMapping.deal_custom_fields);
  if (dealCustom.length > 0) {
    body.custom_fields = dealCustom;
  }

  console.log(`[Deal] Criando deal: "${title}"`, JSON.stringify(body));

  const dealData = await piperunFetch(
    "Deal/Create",
    `${PIPERUN_API_URL}/deals`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(body),
    },
  );

  return dealData;
}

// ---------------------------------------------------------------------------
// Handler principal
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    if (!PIPERUN_TOKEN) {
      console.error("PIPERUN_TOKEN não configurado!");
      return new Response(
        JSON.stringify({ error: "PIPERUN_TOKEN não configurado" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const payload: WebhookPayload = await req.json();
    console.log("=== WEBHOOK RECEBIDO ===");
    console.log("Type:", payload.type, "| Table:", payload.table);
    console.log("Record:", JSON.stringify(payload.record));

    if (payload.type !== "INSERT" || payload.table !== "leads") {
      console.log("Evento ignorado (não é INSERT em leads)");
      return new Response(
        JSON.stringify({ message: "Evento ignorado" }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const lead = payload.record;

    // Garante que custom_data é um objeto (pode vir como string JSON do webhook)
    const customData = parseCustomData(lead.custom_data);
    lead.custom_data = customData;
    console.log("[DEBUG] custom_data type:", typeof payload.record.custom_data, "→ parsed keys:", Object.keys(customData));

    const formMapping = FORM_FIELDS[lead.form_name];
    if (!formMapping) {
      throw new Error(`Formulário desconhecido: ${lead.form_name}`);
    }

    console.log(`\n--- Processando: ${lead.form_name} ---`);
    console.log("custom_data:", JSON.stringify(customData));

    // 1. Nome da empresa
    const companyNameField = COMPANY_NAME_FIELD[lead.form_name] ?? "empresa";
    const companyName = customData[companyNameField] ?? lead.nome;
    console.log(`Empresa: campo="${companyNameField}" → valor="${companyName}"`);

    // 2. Busca ou cria empresa (sempre atualiza custom fields)
    const companyId = await findOrCreateCompany(companyName, customData, formMapping);

    // 3. Busca ou cria pessoa (sempre atualiza custom fields)
    const personId = await findOrCreatePerson(lead, companyId, customData, formMapping);

    // 4. Cria oportunidade
    const deal = await createDeal(lead, personId, companyId, companyName, customData, formMapping);
    const dealId = (deal.data as Record<string, unknown>)?.id;

    console.log(`\n=== SUCESSO: ${lead.form_name} | Company: ${companyId} | Person: ${personId} | Deal: ${dealId} ===\n`);

    return new Response(
      JSON.stringify({
        success: true,
        company_id: companyId,
        person_id: personId,
        deal_id: dealId,
      }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("=== EDGE FUNCTION ERROR ===");
    console.error((error as Error).message);
    console.error((error as Error).stack);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
