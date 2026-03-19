export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string[];
  fullWidth?: boolean;
  /** Show this field only when another field has a specific value */
  conditionalOn?: {
    field: string;
    value: string;
  };
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  fields: FormField[];
}

export const products: Product[] = [
  {
    id: "membership",
    title: "Membership",
    subtitle: "Conexão com o ecossistema",
    image: "/membership.jpg",
    description:
      "Torne-se membro do Instituto Caldeira e acesse uma comunidade de inovação, eventos exclusivos e networking com líderes do ecossistema.",
    highlights: [
      "Networking com líderes do ecossistema",
      "Descontos em programas e espaços",
      "Visibilidade para sua marca",
      "Eventos de matchmaking, investimento e negócios",
    ],
    fields: [
      {
        name: "empresa",
        label: "Empresa",
        type: "text",
        required: true,
        placeholder: "Nome da empresa",
      },
      {
        name: "segmento",
        label: "Segmento",
        type: "select",
        required: true,
        options: ["Marketing, Entretenimento & Lazer",
          "Alimentação & Bebidas",
          "Agronegócios",
          "Jurídico & Prestação de Serviços",
          "Saúde & Farmacía",
          "Transporte, Logística & Mobilidade",
          "Tecnologia & Software",
          "Indústria & Manufatura",
          "Tecnologia & Hardware",
          "Comércio & Varejo",
          "Institucional, Poder Público & ONG",
          "Educação e Recursos Humanos",
          "Finanças, Pagamentos e Investimentos",
          "Energia e Sustentabilidade",
          "Construção, Engenharia & Incorp."],
      },
      {
        name: "num_funcionarios",
        label: "Número de funcionários",
        type: "select",
        required: true,
        options: ["1 a 5", "6 a 20", "21 a 50", "51 a 100", "101 a 500","501 a 999","1000+"],
      },
      {
        name: "nome",
        label: "Nome completo",
        type: "text",
        required: true,
        placeholder: "Seu nome completo",
      },
      {
        name: "email",
        label: "E-mail corporativo",
        type: "email",
        required: true,
        placeholder: "seu@email.com",
      },
      {
        name: "telefone",
        label: "Telefone",
        type: "tel",
        required: true,
        placeholder: "(51) 99999-9999",
      },
      {
        name: "cargo",
        label: "Cargo",
        type: "select",
        required: true,
        options: ["C-LEVEL","Diretor", "Gerente","Coordenador", "Especialista", "Analista", "Assistente", "Trainee", "Estagiário", "Aluno", "Outros"],
      },
    ],
  },
  {
    id: "espaco-fisico",
    title: "Espaço Físico",
    subtitle: "Infraestrutura para inovação",
    image: "/espaco_fisico.jpg",
    description:
      "Utilize os espaços do Instituto Caldeira para eventos, reuniões, workshops e muito mais. Ambientes modernos e preparados para impulsionar a colaboração.",
    highlights: [
      "Salas de reunião equipadas",
      "Espaços de trabalho",
      "Infraestrutura completa de A/V",
    ],
    fields: [
      {
        name: "empresa",
        label: "Empresa",
        type: "text",
        required: true,
        placeholder: "Nome da empresa",
      },
      {
        name: "nome",
        label: "Nome completo",
        type: "text",
        required: true,
        placeholder: "Seu nome completo",
      },
      {
        name: "email",
        label: "E-mail corporativo",
        type: "email",
        required: true,
        placeholder: "seu@email.com",
      },
      {
        name: "telefone",
        label: "Telefone",
        type: "tel",
        required: true,
        placeholder: "(51) 99999-9999",
      },
      {
        name: "m2_desejados",
        label: "M² desejados",
        type: "number",
        required: true,
        placeholder: "Ex: 50",
      },
      {
        name: "modelo_trabalho",
        label: "Modelo de trabalho da empresa",
        type: "select",
        required: true,
        options: ["presencial", "híbrido", "remoto"],
      },
      {
        name: "espaco_sede",
        label: "O espaço será a sua sede?",
        type: "select",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        name: "times_hub",
        label: "Quais times utilizariam o hub?",
        type: "text",
        required: true,
        placeholder: "Ex: Comercial, Tecnologia, Marketing...",
      },
      {
        name: "num_pessoas",
        label: "Quantas pessoas frequentariam o hub?",
        type: "select",
        required: true,
        options: ["1-10", "11-30", "31-50", "51-100", "100+"],
      },
      {
        name: "urgencia",
        label: "Urgência",
        type: "select",
        required: true,
        options: ["Imediata (até 90 dias)", "Moderada (até 180 dias)", "Longo prazo (+180 dias)"],
      },
    ],
  },
  {
    id: "programas-aceleracao",
    title: "Programas de Aceleração",
    subtitle: "Acelere sua startup",
    image: "/programas_aceleracao.jpg",
    description:
      "Participe dos programas de aceleração do Instituto Caldeira e leve sua startup ao próximo nível com mentoria, conexões e recursos exclusivos.",
    highlights: [
      "Mentoria especializada",
      "Conexão com investidores",
      "Acesso a mercado",
      "Metodologia validada",
    ],
    fields: [
      {
        name: "nome",
        label: "Nome",
        type: "text",
        required: true,
        placeholder: "Seu nome completo",
      },
      {
        name: "email",
        label: "E-mail",
        type: "email",
        required: true,
        placeholder: "seu@email.com",
      },
      {
        name: "telefone",
        label: "Telefone",
        type: "tel",
        required: true,
        placeholder: "(51) 99999-9999",
      },
      {
        name: "nome_startup",
        label: "Nome da startup",
        type: "text",
        required: true,
        placeholder: "Nome da sua startup",
      },
      {
        name: "setor",
        label: "Setor de atuação",
        type: "text",
        required: true,
        placeholder: "Ex: FinTech, HealthTech, EdTech...",
      },
      {
        name: "estagio_negocio",
        label: "Estágio do negócio",
        type: "select",
        required: true,
        options: [
          "Ideação: Refinando a ideia do negócio ou conceito.",
          "Validação: Produto em validação, mas ainda sem vendas.",
          "Operação: Produto lançado no mercado, em fase inicial de vendas.",
          "Tração: Expansão ativa e aumento consistente de clientes/receita.",
          "Escala: Estabelecida no mercado, buscando expansão e otimização.",
        ],
      },
      {
        name: "rodada_captacao",
        label: "Já realizou rodada de captação?",
        type: "select",
        required: true,
        options: ["Sim", "Não"],
      },
      {
        name: "total_captado",
        label: "Qual o total já captado?",
        type: "select",
        required: true,
        options: [
          "Bootstrap (100% capital próprio)",
          "Pre-seed (100K - 1M)",
          "Seed (3M - 10M)",
          "Série A ou superior (+10M)",
        ],
        conditionalOn: {
          field: "rodada_captacao",
          value: "Sim",
        },
      },
      {
        name: "pitch",
        label: "Descreva sua startup em poucas palavras",
        type: "textarea",
        required: true,
        placeholder: "Problema que resolve, solução, diferencial...",
        fullWidth: true,
      },
    ],
  },
  {
    id: "missoes-internacionais",
    title: "Missões Internacionais",
    subtitle: "Expandindo fronteiras",
    image: "/missoes_internacionais.jpg",
    description:
      "Participe de missões internacionais e conecte-se com ecossistemas de inovação ao redor do mundo. Visite hubs, conheça startups e amplie sua visão.",
    highlights: [
      "Visitas a hubs globais",
      "Networking internacional",
      "Imersão em ecossistemas",
      "Curadoria especializada",
    ],
    fields: [
      {
        name: "nome",
        label: "Nome completo",
        type: "text",
        required: true,
        placeholder: "Seu nome completo",
      },
      {
        name: "email",
        label: "E-mail corporativo",
        type: "email",
        required: true,
        placeholder: "seu@email.com",
      },
      {
        name: "telefone",
        label: "Telefone",
        type: "tel",
        required: true,
        placeholder: "(51) 99999-9999",
      },
      {
        name: "empresa",
        label: "Empresa",
        type: "text",
        required: true,
        placeholder: "Nome da empresa",
      },
    ],
  },
  {
    id: "parceiro-empregabilidade",
    title: "Contrate jovens talentos",
    subtitle: "Conectando formação ao trabalho",
    image: "/parceiro_empregabilidade.jpg",
    description:
      "Seja parceiro de empregabilidade do Geração Caldeira, o programa educacional do Instituto Caldeira que capacita e emprega jovens para a nova economia. Áreas de atuação:",
    highlights: [
      "Marketing e Design",
      "Programação",
      "Dados e Inteligência Artificial",
      "Gestão Comercial",
    ],
    fields: [
      {
        name: "nome",
        label: "Nome completo",
        type: "text",
        required: true,
        placeholder: "Seu nome completo",
      },
      {
        name: "email",
        label: "E-mail corporativo",
        type: "email",
        required: true,
        placeholder: "seu@email.com",
      },
      {
        name: "telefone",
        label: "Telefone",
        type: "tel",
        required: true,
        placeholder: "(51) 99999-9999",
      },
      {
        name: "empresa",
        label: "Empresa",
        type: "text",
        required: true,
        placeholder: "Nome da empresa",
      },
      {
        name: "possui_vagas",
        label: "Sua empresa possui vagas em aberto?",
        type: "select",
        required: true,
        options: ["Sim", "Não"],
      },
    ],
  },
];
