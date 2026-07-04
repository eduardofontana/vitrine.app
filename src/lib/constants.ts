export const CATEGORIAS = [
  { value: "MICRO_SAAS", label: "Micro-SaaS" },
  { value: "APP_WEB", label: "App Web" },
  { value: "APP_MOBILE", label: "App Mobile" },
  { value: "LANDING_PAGE", label: "Landing Page" },
  { value: "TEMPLATE", label: "Template" },
  { value: "AUTOMACAO", label: "Automacao" },
  { value: "BOT", label: "Bot" },
  { value: "API", label: "API" },
  { value: "E_COMMERCE", label: "E-commerce" },
  { value: "EXTENSAO", label: "Extensao" },
  { value: "OUTRO", label: "Outro" },
] as const;

export const STATUS_PROJETO = [
  { value: "IDEIA_VALIDADA", label: "Ideia validada" },
  { value: "MVP", label: "MVP" },
  { value: "EM_PRODUCAO", label: "Em producao" },
  { value: "COM_USUARIOS", label: "Com usuarios" },
  { value: "COM_RECEITA", label: "Com receita" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "PRONTO_PARA_VENDA", label: "Pronto para venda" },
] as const;

export const APPROVAL_STATUS = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "REJEITADO", label: "Rejeitado" },
] as const;

export const INTEREST_TYPES = [
  { value: "QUERO_COMPRAR", label: "Quero comprar" },
  { value: "QUERO_NEGOCIAR", label: "Quero negociar" },
  { value: "QUERO_SABER_MAIS", label: "Quero saber mais" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIAS.map((category) => [category.value, category.label])
);

export const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUS_PROJETO.map((status) => [status.value, status.label])
);
