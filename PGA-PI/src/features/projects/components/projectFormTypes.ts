export enum PapelProjeto {
  Responsavel = "Responsavel",
  Colaborador = "Colaborador",
}

export enum TipoVinculoHAE {
  HAE15 = "15",
  HAE25 = "25",
  HAE40 = "40",
  NaoSeAplica = "NaoSeAplica",
}

export interface ProjetoPessoa {
  id: number; // Frontend local ID
  pessoaId: string; // Corresponds to pessoa_id in DB, fetched from mock/API
  nome: string;
  papel: PapelProjeto;
  cargaHorariaSemanal?: string; // number in schema, keep string for input
  tipoVinculoHAE?: TipoVinculoHAE | string;
}

export enum StatusVerificacao {
  Pendente = "Pendente",
  OK = "OK",
  RequerAcao = "RequerAcao",
}

export interface EtapaProcesso {
  id: number; // Frontend local ID
  descricao: string;
  entregavelLinkSei?: string;
  numeroRef?: string;
  dataVerificacaoPrevista?: string;
  dataVerificacaoRealizada?: string;
  statusVerificacao: StatusVerificacao | string;
}

export enum TipoAnexo {
  MaterialPermanente = "MaterialPermanente",
  MaterialConsumo = "MaterialConsumo",
  ReagenteQuimico = "ReagenteQuimico",
  Livro = "Livro",
  Software = "Software",
}

export interface AquisicaoItem {
  id: number; // Frontend local ID
  tipoAnexo: TipoAnexo | string;
  descricaoItem: string;
  unidadeMedida?: string;
  quantidade: string; // number in schema, keep string for input
  justificativa?: string;
  valorUnitarioEstimado?: string; // number in schema, keep string for input
  valorTotalEstimado?: string; // number in schema, keep string for input
}

export interface EixoTematico {
  id: number; // Corresponds to eixo_id
  numero: number;
  nome: string;
}

export interface PrioridadeAcao {
  id: number; // Corresponds to prioridade_id
  grau: number;
  descricao: string;
  tipo_gestao: string;
} 