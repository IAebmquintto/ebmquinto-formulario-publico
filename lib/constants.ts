/** Lista das 27 unidades federativas do Brasil, para o select de Estado. */
export const UF_OPTIONS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

/** Opções fixas do dropdown "Qual a área de interesse?". */
export const DESIRED_POSITION_OPTIONS = [
  "ADM/FINANCEIRO - Analista",
  "ADM/FINANCEIRO - Assistente",
  "ADM/FINANCEIRO - Coordenador(a)",
  "ADM/FINANCEIRO - Estágio",
  "ADM/FINANCEIRO - Gerente",
  "ATENDIMENTO",
  "ATENDIMENTO - Assistente",
  "ATENDIMENTO - Digital",
  "B.I. - Analista",
  "B.I. - Assistente",
  "Casting",
  "CRIAÇÃO - Redação",
  "CRIAÇÃO - Redação - Estágio",
  "CRIAÇÃO - Revisor(a)",
  "CRIAÇÃO - Revisor(a) - Estágio",
  "MÍDIA - Analista",
  "MÍDIA - Assistente",
  "MÍDIA - Estágio",
  "MOTOBOY",
  "OUTRO",
  "PERFORMANCE - Analista",
  "PERFORMANCE - Assistente",
  "PLANEJAMENTO - Coordenador(a)",
  "PLANEJAMENTO - Head",
  "PLANEJAMENTO - Planner",
  "PLANEJAMENTO - Social Media",
  "PRODUÇÃO DE CONTEÚDO - Analista",
  "PRODUÇÃO DE CONTEÚDO - Filmmaker (audio visual)",
  "PRODUÇÃO ELETRÔNICA - Produtor(a)",
  "PRODUÇÃO GRÁFICA - Produtor(a)",
  "R.H. - Analista",
  "R.H. - Assistente",
  "RECEPÇÃO",
  "SERVIÇOS GERAIS - Auxiliar",
  "TRÁFEGO",
  "TECH - IA & Automações",
  "TECH - IA & Automações - Assistente",
  "TECH - IA & Automações - Estágio",
  "TECH - VIBE CODING",
  "TECH - VIBE CODING - Assistente",
  "TECH - VIBE CODING - Estágio",
] as const;

/** Opções fixas do dropdown "Há quanto tempo atua nesta área?". */
export const EXPERIENCE_TIME_OPTIONS = [
  "Na faculdade",
  "Até um ano de mercado",
  "Até 3 anos",
  "De 3 a 5 anos",
  "De 5 a 7 anos",
  "De 7 a 10 anos",
  "Acima de 10 anos",
] as const;

/** Nomes completos dos 27 estados brasileiros (Casting/Produção de Conteúdo usam nome completo, não sigla). */
export const BRAZILIAN_STATE_NAMES = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
] as const;

/** Opções fixas do dropdown "Idade" (casting). */
export const CASTING_AGE_RANGE_OPTIONS = [
  "Até 8 anos (acompanhado)",
  "8 - 12 anos (acompanhado)",
  "12 - 17 anos (acompanhado)",
  "18 - 25 anos",
  "26 - 35 anos",
  "36 - 50 anos",
  "50+",
] as const;

/** Opções fixas do dropdown "Valor da Diária" (casting). */
export const CASTING_DAILY_RATE_OPTIONS = [
  "R$ 100",
  "Entre R$ 100 e R$ 200",
  "Entre R$ 200 e R$ 300",
] as const;

/** Opções fixas do dropdown "CNH" (casting). */
export const CASTING_DRIVER_LICENSE_OPTIONS = [
  "NÃO",
  "CATEGORIA - A",
  "CATEGORIA - B",
  "CATEGORIA - A e B",
  "CATEGORIA - C,D ou E",
] as const;

/** Tipos de arquivo aceitos para o upload de fotos de casting. */
export const ACCEPTED_CASTING_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ACCEPTED_CASTING_PHOTO_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.gif";
export const MAX_CASTING_PHOTO_SIZE_MB = 8;
export const MAX_CASTING_PHOTO_SIZE_BYTES =
  MAX_CASTING_PHOTO_SIZE_MB * 1024 * 1024;
export const MAX_CASTING_PHOTOS = 5;

/** Tipos de arquivo aceitos para o upload do currículo. */
export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** Extensões aceitas, usadas no atributo `accept` do input de arquivo. */
export const ACCEPTED_RESUME_EXTENSIONS = ".pdf,.doc,.docx";

/** Tamanho máximo do currículo, em bytes (deve casar com `RESUME_MAX_SIZE_MB` do backend). */
export const MAX_RESUME_SIZE_MB = 5;
export const MAX_RESUME_SIZE_BYTES = MAX_RESUME_SIZE_MB * 1024 * 1024;

/** Tipos de arquivo aceitos para o upload de currículo de Produção de Conteúdo. */
export const ACCEPTED_CONTENT_PRODUCER_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
] as const;

export const ACCEPTED_CONTENT_PRODUCER_RESUME_EXTENSIONS =
  ".pdf,.doc,.docx,.pptx,.jpg,.jpeg,.png";
