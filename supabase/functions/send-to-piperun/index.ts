import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const PIPERUN_TOKEN = Deno.env.get("PIPERUN_TOKEN");
const PIPERUN_API_URL = "https://api.pipe.run/v1";
const ORIGIN_ID = 764553;

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
  custom_data: Record<string, string>;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: LeadPayload;
  schema: string;
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
  "missoes-internacionais":     { pipeline_id: 73249,  stage_id: 664079 },
  "parceiro-empregabilidade":   { pipeline_id: 103101, stage_id: 449372 },
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

// Qual campo do custom_data contém o nome da empresa para cada formulário
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
  company_custom_fields: Record<string, number>;   // campo_custom_data → piperun_field_id
  person_custom_fields: Record<string, number>;
  deal_custom_fields: Record<string, number>;
  segment_field?: string;  // campo do custom_data que mapeia para segment_id
}

const FORM_FIELDS: Record<string, FormFieldMapping> = {
  "membership": {
    company_custom_fields: {
      "num_funcionarios": 464592,
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
      "times_hub": 464292,
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

const headers = () => ({
  "Token": PIPERUN_TOKEN!,
  "Content-Type": "application/json",
});

function buildCustomFieldsArray(
  data: Record<string, string>,
  mapping: Record<string, number>,
): CustomField[] {
  const fields: CustomField[] = [];
  for (const [dataKey, piperunId] of Object.entries(mapping)) {
    const value = data[dataKey];
    if (value !== undefined && value !== "") {
      fields.push({ id: piperunId, value });
    }
  }
  return fields;
}

// Companies usam formato objeto { "id": "valor" }
function buildCustomFieldsObject(
  data: Record<string, string>,
  mapping: Record<string, number>,
): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const [dataKey, piperunId] of Object.entries(mapping)) {
    const value = data[dataKey];
    if (value !== undefined && value !== "") {
      fields[String(piperunId)] = value;
    }
  }
  return fields;
}

// ---------------------------------------------------------------------------
// API: Company
// ---------------------------------------------------------------------------

async function findOrCreateCompany(
  companyName: string,
  lead: LeadPayload,
  formMapping: FormFieldMapping,
): Promise<number> {
  // Busca empresa pelo nome
  const searchRes = await fetch(
    `${PIPERUN_API_URL}/companies?name=${encodeURIComponent(companyName)}`,
    { headers: { "Token": PIPERUN_TOKEN! } },
  );
  const searchData = await searchRes.json();

  if (searchData.data?.length > 0) {
    return searchData.data[0].id;
  }

  // Monta body para criação
  const body: Record<string, unknown> = {
    name: companyName,
  };

  // segment_id (nativo) — só membership usa
  if (formMapping.segment_field) {
    const segmentValue = lead.custom_data[formMapping.segment_field];
    const segmentId = segmentValue ? SEGMENT_MAP[segmentValue] : undefined;
    if (segmentId) {
      body.segment_id = segmentId;
    }
  }

  // Custom fields da empresa
  const companyCustom = buildCustomFieldsObject(
    lead.custom_data,
    formMapping.company_custom_fields,
  );
  if (Object.keys(companyCustom).length > 0) {
    body.custom_fields = companyCustom;
  }

  const createRes = await fetch(`${PIPERUN_API_URL}/companies`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Piperun createCompany failed: ${createRes.status} - ${err}`);
  }

  const createData = await createRes.json();
  return createData.data.id;
}

// ---------------------------------------------------------------------------
// API: Person
// ---------------------------------------------------------------------------

async function findOrCreatePerson(
  lead: LeadPayload,
  companyId: number,
  formMapping: FormFieldMapping,
): Promise<number> {
  // Busca pessoa pelo email
  const searchRes = await fetch(
    `${PIPERUN_API_URL}/persons?email=${encodeURIComponent(lead.email)}`,
    { headers: { "Token": PIPERUN_TOKEN! } },
  );
  const searchData = await searchRes.json();

  if (searchData.data?.length > 0) {
    return searchData.data[0].id;
  }

  // Cria nova pessoa
  const body: Record<string, unknown> = {
    name: lead.nome,
    email: lead.email,
    phone: lead.telefone,
    company_id: companyId,
  };

  // Custom fields da pessoa (ex: cargo)
  const personCustom = buildCustomFieldsArray(
    lead.custom_data,
    formMapping.person_custom_fields,
  );
  if (personCustom.length > 0) {
    body.custom_fields = personCustom;
  }

  const createRes = await fetch(`${PIPERUN_API_URL}/persons`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Piperun createPerson failed: ${createRes.status} - ${err}`);
  }

  const createData = await createRes.json();
  return createData.data.id;
}

// ---------------------------------------------------------------------------
// API: Deal
// ---------------------------------------------------------------------------

async function createDeal(
  lead: LeadPayload,
  personId: number,
  companyId: number,
  companyName: string,
  formMapping: FormFieldMapping,
) {
  const pipeline = PIPELINE_MAP[lead.form_name] ?? PIPELINE_MAP["membership"];

  // Título único: "{empresa} - SSB26" + timestamp para evitar duplicidade
  const timestamp = new Date(lead.created_at).toLocaleDateString("pt-BR");
  const title = `${companyName} - SSB26 (${timestamp})`;

  const body: Record<string, unknown> = {
    title,
    pipeline_id: pipeline.pipeline_id,
    stage_id: pipeline.stage_id,
    person_id: personId,
    company_id: companyId,
    origin_id: ORIGIN_ID,
  };

  // Custom fields da oportunidade
  const dealCustom = buildCustomFieldsArray(
    lead.custom_data,
    formMapping.deal_custom_fields,
  );
  if (dealCustom.length > 0) {
    body.custom_fields = dealCustom;
  }

  const res = await fetch(`${PIPERUN_API_URL}/deals`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Piperun createDeal failed: ${res.status} - ${error}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Handler principal
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  try {
    if (!PIPERUN_TOKEN) {
      return new Response(
        JSON.stringify({ error: "PIPERUN_TOKEN não configurado" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const payload: WebhookPayload = await req.json();

    if (payload.type !== "INSERT" || payload.table !== "leads") {
      return new Response(
        JSON.stringify({ message: "Evento ignorado" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    const lead = payload.record;
    const formMapping = FORM_FIELDS[lead.form_name];
    if (!formMapping) {
      throw new Error(`Formulário desconhecido: ${lead.form_name}`);
    }

    // 1. Nome da empresa (varia por formulário)
    const companyNameField = COMPANY_NAME_FIELD[lead.form_name] ?? "empresa";
    const companyName = lead.custom_data[companyNameField] ?? lead.nome;

    // 2. Busca ou cria a empresa (com custom fields de empresa + segment_id)
    const companyId = await findOrCreateCompany(companyName, lead, formMapping);

    // 3. Busca ou cria a pessoa (vinculada à empresa, com custom fields de pessoa)
    const personId = await findOrCreatePerson(lead, companyId, formMapping);

    // 4. Cria a oportunidade (com custom fields de deal)
    const deal = await createDeal(lead, personId, companyId, companyName, formMapping);

    console.log(`Lead processado: ${lead.form_name} | Company: ${companyId} | Person: ${personId} | Deal: ${deal.data?.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        company_id: companyId,
        person_id: personId,
        deal_id: deal.data?.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
