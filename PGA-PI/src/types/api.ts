// Enums do backend
export enum TipoUsuario {
  ADMINISTRADOR = "Administrador",
  CPS = "CPS",
  REGIONAL = "Regional",
  DIRETOR = "Diretor",
  COORDENADOR = "Coordenador",
  ADMINISTRATIVO = "Administrativo",
  DOCENTE = "Docente",
}

export enum AnexoProjetoUm {
  ANEXO1 = "1",
  ANEXO2 = "2",
  ANEXO3 = "3",
  ANEXO4 = "4",
}

export enum StatusVerificacao {
  PENDENTE = "Pendente",
  OK = "OK",
  REQUER_ACAO = "RequerAcao",
}

export interface User {
  pessoa_id: number;
  nome: string;
  email?: string;
  nome_usuario?: string;
  tipo_usuario: TipoUsuario;
  ativo?: boolean;
  unidade_id?: number;
  createdAt?: Date;
  unidades?: Array<{
    pessoa_id: number;
    unidade_id: number;
    data_vinculo: string;
    ativo: boolean;
    unidade: {
      unidade_id: number;
      codigo_fnnn: string;
      nome_completo: string;
      diretor_nome?: string;
    }
  }>;
}

export interface Pessoa {
  pessoa_id: number;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
  ativo: boolean;
  criado_em?: string;
  unidades?: Array<{
    unidade_id: number;
    nome_completo: string;
    ativo: boolean;
  }>;
}

export interface EixoTematico {
  eixo_id: number;
  numero: number;
  nome: string;
  descricao?: string;
}

export interface PrioridadeAcao {
  prioridade_id: number;
  grau: number;
  descricao: string;
  tipo_gestao: string;
  detalhes?: string;
}

export interface Tema {
  tema_id: number;
  tema_num: number;
  eixo_id: number;
  descricao: string;
}

export interface AcaoProjeto {
  acao_projeto_id: number;
  pga_id: number;
  eixo_id: number;
  prioridade_id: number;
  tema: string;
  o_que_sera_feito: string;
  por_que_sera_feito: string;
  data_inicio?: Date;
  data_final?: Date;
  objetivos_institucionais_referenciados?: string;
  obrigatorio_inclusao: boolean;
  obrigatorio_sustentabilidade: boolean;

  // Relacionamentos
  eixo?: EixoTematico;
  prioridade?: PrioridadeAcao;
  aquisicoes?: Attachment1[];
  etapas?: any[];
  pessoas?: any[];
}

export interface Attachment1 {
  id: string;
  item: string;
  projeto?: AcaoProjeto;
  projetoId?: string;
  denominacaoOuEspecificacao: string;
  quantidade: number;
  precoTotalEstimado: number;
  flag: AnexoProjetoUm;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EntregavelLinkSei {
  entregavel_id: number;
  entregavel_numero: string;
  descricao: string;
  detalhes?: string;
}

export interface SituacaoProblema {
  situacao_id: number;
  codigo_categoria: string;
  descricao: string;
  fonte?: string | null;
  ordem?: number | null;
  ativo: boolean;
  criado_em: string;
  criado_por?: number | null;
  atualizado_em: string;
  atualizado_por?: number | null;
}

export interface TipoVinculoHAE {
  id: number;
  sigla: string;
  descricao: string;
  detalhes?: string;
}

// DTOs para criação/atualização
export interface CreateAttachment1Dto {
  item: string;
  projetoId: string;
  denominacaoOuEspecificacao: string;
  quantidade: number;
  precoTotalEstimado: number;
  flag: AnexoProjetoUm;
}

export interface UpdateAttachment1Dto {
  item?: string;
  projetoId?: string;
  denominacaoOuEspecificacao?: string;
  quantidade?: number;
  precoTotalEstimado?: number;
  flag?: AnexoProjetoUm;
}

export interface CreateProject1Dto {
  pga_id: number;
  eixo_id: number;
  prioridade_id: number;
  tema: string;
  o_que_sera_feito: string;
  por_que_sera_feito: string;
  data_inicio?: string;
  data_final?: string;
  objetivos_institucionais_referenciados?: string;
  obrigatorio_inclusao: boolean;
  obrigatorio_sustentabilidade: boolean;
}

export interface UpdateProject1Dto {
  pga_id?: number;
  eixo_id?: number;
  prioridade_id?: number;
  tema?: string;
  o_que_sera_feito?: string;
  por_que_sera_feito?: string;
  data_inicio?: string;
  data_final?: string;
  objetivos_institucionais_referenciados?: string;
  obrigatorio_inclusao?: boolean;
  obrigatorio_sustentabilidade?: boolean;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Adicione esta interface se ainda não existir

export interface SolicitacaoAcesso {
  solicitacao_id: number;
  nome: string;
  email: string;
  unidade_id: number;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  data_solicitacao: string;
  data_processamento?: string | null;
  processado_por?: number | null;
  tipo_usuario_concedido?: string | null;
  unidade?: {
    unidade_id: number;
    nome_completo: string;
    codigo_fnnn: string;
  };
  processador?: {
    pessoa_id: number;
    nome: string;
    email: string;
  };
}
