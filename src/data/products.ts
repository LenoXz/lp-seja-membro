export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string[];
  fullWidth?: boolean;
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

const commonFields: FormField[] = [
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
];

export const products: Product[] = [
  {
    id: "membership",
    title: "Membership",
    subtitle: "Conexão com o ecossistema",
    image: "/membership.jpg",
    description:
      "Torne-se membro do Instituto Caldeira e tenha acesso a uma comunidade vibrante de inovação, eventos exclusivos e oportunidades de networking com líderes do ecossistema.",
    highlights: [
      "Acesso a eventos exclusivos",
      "Networking com líderes do ecossistema",
      "Descontos em programas e espaços",
      "Visibilidade para sua marca",
    ],
    fields: [
      ...commonFields,
      {
        name: "porte_empresa",
        label: "Porte da empresa",
        type: "select",
        required: true,
        options: ["MEI", "Micro", "Pequena", "Média", "Grande"],
      },
      {
        name: "setor_atuacao",
        label: "Setor de atuação",
        type: "text",
        required: true,
        placeholder: "Ex: Tecnologia, Saúde, Educação...",
      },
      {
        name: "num_colaboradores",
        label: "Número de colaboradores",
        type: "select",
        required: false,
        options: ["1-10", "11-50", "51-200", "201-500", "500+"],
      },
      {
        name: "motivacao",
        label: "O que motiva sua empresa a ser membro?",
        type: "textarea",
        required: false,
        placeholder: "Conte-nos um pouco sobre seus objetivos...",
        fullWidth: true,
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
      "Auditório para eventos",
      "Espaços de coworking",
      "Infraestrutura completa de A/V",
    ],
    fields: [
      ...commonFields,
      {
        name: "tipo_espaco",
        label: "Tipo de espaço desejado",
        type: "select",
        required: true,
        options: [
          "Sala de reunião",
          "Auditório",
          "Espaço para workshop",
          "Coworking",
          "Área externa",
        ],
      },
      {
        name: "capacidade",
        label: "Capacidade estimada (pessoas)",
        type: "select",
        required: true,
        options: ["1-10", "11-30", "31-80", "81-150", "150+"],
      },
      {
        name: "data_desejada",
        label: "Data desejada",
        type: "text",
        required: false,
        placeholder: "Ex: Março/2026 ou data específica",
      },
      {
        name: "descricao_evento",
        label: "Descreva brevemente o evento ou uso",
        type: "textarea",
        required: false,
        placeholder: "Tipo de evento, necessidades especiais...",
        fullWidth: true,
      },
    ],
  },
  {
    id: "programas-aceleracao",
    title: "Programas de Aceleração",
    subtitle: "Acelere sua startup",
    image: "/programas_aceleração.jpg",
    description:
      "Participe dos programas de aceleração do Instituto Caldeira e leve sua startup ao próximo nível com mentoria, conexões e recursos exclusivos.",
    highlights: [
      "Mentoria especializada",
      "Conexão com investidores",
      "Acesso a mercado",
      "Metodologia validada",
    ],
    fields: [
      ...commonFields,
      {
        name: "estagio_startup",
        label: "Estágio da startup",
        type: "select",
        required: true,
        options: [
          "Ideação",
          "Validação",
          "Tração",
          "Escala",
          "Consolidação",
        ],
      },
      {
        name: "setor",
        label: "Setor de atuação",
        type: "text",
        required: true,
        placeholder: "Ex: FinTech, HealthTech, EdTech...",
      },
      {
        name: "faturamento",
        label: "Faturamento anual",
        type: "select",
        required: false,
        options: [
          "Pré-receita",
          "Até R$ 100k",
          "R$ 100k - R$ 500k",
          "R$ 500k - R$ 1M",
          "Acima de R$ 1M",
        ],
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
    image: "/missoes_internacionais.JPG",
    description:
      "Participe de missões internacionais e conecte-se com ecossistemas de inovação ao redor do mundo. Visite hubs, conheça startups e amplie sua visão.",
    highlights: [
      "Visitas a hubs globais",
      "Networking internacional",
      "Imersão em ecossistemas",
      "Curadoria especializada",
    ],
    fields: [
      ...commonFields,
      {
        name: "destino_interesse",
        label: "Destino de interesse",
        type: "select",
        required: true,
        options: [
          "Estados Unidos (Silicon Valley)",
          "Europa (Lisboa/Barcelona)",
          "Israel (Tel Aviv)",
          "Ásia (Singapura/Tóquio)",
          "Aberto a sugestões",
        ],
      },
      {
        name: "num_participantes",
        label: "Número de participantes",
        type: "select",
        required: true,
        options: ["1", "2-3", "4-5", "6-10", "10+"],
      },
      {
        name: "periodo_interesse",
        label: "Período de interesse",
        type: "text",
        required: false,
        placeholder: "Ex: 2º semestre de 2026",
      },
      {
        name: "expectativas",
        label: "Expectativas com a missão",
        type: "textarea",
        required: false,
        placeholder: "O que espera dessa experiência...",
        fullWidth: true,
      },
    ],
  },
  {
    id: "parceiro-empregabilidade",
    title: "Parceiro de Empregabilidade",
    subtitle: "Conectando talentos",
    image: "/parceiro_empregabilidade.jpg",
    description:
      "Torne-se um parceiro de empregabilidade e tenha acesso a talentos qualificados formados pelos programas do Instituto Caldeira.",
    highlights: [
      "Acesso a talentos qualificados",
      "Processos seletivos facilitados",
      "Diversidade e inclusão",
      "Impacto social mensurável",
    ],
    fields: [
      ...commonFields,
      {
        name: "vagas_disponiveis",
        label: "Quantidade de vagas disponíveis",
        type: "select",
        required: true,
        options: ["1-5", "6-15", "16-30", "31-50", "50+"],
      },
      {
        name: "area_atuacao",
        label: "Área de atuação das vagas",
        type: "select",
        required: true,
        options: [
          "Tecnologia / Desenvolvimento",
          "Dados / Analytics",
          "Design / UX",
          "Marketing / Comercial",
          "Operações / Logística",
          "Outras",
        ],
      },
      {
        name: "modelo_trabalho",
        label: "Modelo de trabalho",
        type: "select",
        required: false,
        options: ["Presencial", "Híbrido", "Remoto"],
      },
      {
        name: "detalhes_vaga",
        label: "Detalhes adicionais sobre as vagas",
        type: "textarea",
        required: false,
        placeholder: "Perfil desejado, benefícios, requisitos...",
        fullWidth: true,
      },
    ],
  },
];
