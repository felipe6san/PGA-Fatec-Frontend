import { Attachment } from "@/types/api";

export enum PapelProjeto {
  Responsavel = "Responsavel",
  Colaborador = "Colaborador",
}

export interface TipoVinculoHAE {
  id: number;
  sigla: string;
  descricao: string;
  detalhes?: string;
  ativo: boolean;
}

// Interface para pessoa vinda da API - Movida para o arquivo de tipos
export interface PessoaAPI {
  pessoa_id: number;
  nome: string;
  email?: string;
  tipo_usuario?: string;
}

export interface ProjetoPessoa {
  id: number;
  pessoaId: string;
  nome: string;
  papel: PapelProjeto;
  cargaHorariaSemanal?: string;
  tipoVinculoHAE?: string;
}

export enum StatusVerificacao {
  Pendente = "Pendente",
  OK = "OK",
  RequerAcao = "RequerAcao",
}

export interface EtapaProcesso {
  id: number;
  descricao: string;
  entregavelLinkSei?: string;
  numeroRef?: string;
  dataVerificacaoPrevista?: string;
  dataVerificacaoRealizada?: string;
  statusVerificacao?: StatusVerificacao | string;
  anexos?: AttachmentItem[];
}

export enum TipoAnexo {
  MaterialPermanente = "MaterialPermanente",
  MaterialConsumo = "MaterialConsumo",
  ReagenteQuimico = "ReagenteQuimico",
  Livro = "Livro",
  Software = "Software",
}

export interface AttachmentItem {
  anexo_id: number;
  etapa_processo_id: number;
  entregavel_id?: number;
  item: string;
  descricao: string;
  quantidade: number;
  preco_unitario_estimado: number;
  preco_total_estimado: number;
  criado_em?: string;
  atualizado_em?: string;
}

export interface EixoTematico {
  id: number; // Corresponds to eixo_id
  numero: number;
  nome: string;
}

export interface PrioridadeAcao {
  prioridade_id: string;
  grau: number;
  descricao: string;
  tipo_gestao: string;
}
