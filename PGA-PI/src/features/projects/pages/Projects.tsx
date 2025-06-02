import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";
import React from "react";
import {
  ProjetoPessoa,
  EtapaProcesso,
  AquisicaoItem,
  EixoTematico as FullEixoTematico,
  PrioridadeAcao as FullPrioridadeAcao,
  PapelProjeto,
  StatusVerificacao,
  TipoAnexo,
  TipoVinculoHAE,
} from "../components/projectFormTypes";

interface DisplayableAcaoProjeto {
  id: number;
  tema: string;
  nomeProjeto?: string;
  statusAcao: "Planejado" | "Em Andamento" | "Concluído" | "Cancelado" | "Pendente";
  progresso: number;
  dataInicio: string;
  dataFinal: string;
  oQueSeraFeito: string;
  porQueSeraFeito?: string;
  eixoTematico: { id: number; nome: string };
  prioridadeAcao: { id: number; descricao: string };
  pessoas: ProjetoPessoa[];
  etapas: EtapaProcesso[];
  aquisicoes?: AquisicaoItem[];
  situacoesProblema?: string[];
  objetivosInstitucionaisReferenciados?: string;
  obrigatorioInclusao?: boolean;
  obrigatorioSustentabilidade?: boolean;
  origemDemanda?: string;
  anoPGA?: number;
}

const mockEixos: FullEixoTematico[] = [
  { id: 1, numero: 1, nome: "Ensino de Qualidade" },
  { id: 2, numero: 2, nome: "Pesquisa e Inovação Aplicada" },
  { id: 3, numero: 3, nome: "Extensão e Articulação com a Sociedade" },
  { id: 4, numero: 4, nome: "Gestão Institucional e Infraestrutura" },
];

const mockPrioridades: FullPrioridadeAcao[] = [
  { id: 1, grau: 1, descricao: "Alta" },
  { id: 2, grau: 2, descricao: "Média" },
  { id: 3, grau: 3, descricao: "Baixa" },
];

const mockPessoasCadastradas: ProjetoPessoa[] = [
  { id: 1, pessoaId: "user1", nome: "Alice Silva (Docente)", papel: PapelProjeto.Responsavel },
  { id: 2, pessoaId: "user2", nome: "Bruno Costa (Docente)", papel: PapelProjeto.Colaborador, cargaHorariaSemanal: "10", tipoVinculoHAE: TipoVinculoHAE.HAE15 },
  { id: 3, pessoaId: "user3", nome: "Carla Dias (Administrativo)", papel: PapelProjeto.Colaborador, cargaHorariaSemanal: "20", tipoVinculoHAE: TipoVinculoHAE.NaoSeAplica },
  { id: 4, pessoaId: "user4", nome: "Daniel Oliveira (Gestor)", papel: PapelProjeto.Responsavel },
  { id: 5, pessoaId: "user5", nome: "Eduarda Lima (Docente)", papel: PapelProjeto.Colaborador, cargaHorariaSemanal: "5", tipoVinculoHAE: TipoVinculoHAE.HAE25 },
];

const projectsData: DisplayableAcaoProjeto[] = [
  {
    id: 1,
    tema: "Modernização dos Laboratórios de Informática",
    nomeProjeto: "LabInova FATEC",
    statusAcao: "Em Andamento",
    progresso: 65,
    dataInicio: "2024-03-01",
    dataFinal: "2025-06-30",
    oQueSeraFeito: "Visa atualizar os equipamentos e a infraestrutura dos laboratórios de informática da FATEC para suportar as novas demandas curriculares e de pesquisa, incluindo aquisição de novos computadores, softwares e mobiliário.",
    porQueSeraFeito: "Os laboratórios atuais estão com equipamentos defasados, impactando a qualidade do ensino e a capacidade de realização de projetos inovadores pelos alunos.",
    eixoTematico: {id: mockEixos[3].id, nome: mockEixos[3].nome},
    prioridadeAcao: {id: mockPrioridades[0].id, descricao: mockPrioridades[0].descricao},
    pessoas: [mockPessoasCadastradas[0], mockPessoasCadastradas[1]],
    etapas: [
      { id: 1, descricao: "Levantamento de necessidades e especificações técnicas", statusVerificacao: StatusVerificacao.OK, dataVerificacaoPrevista: "2024-04-15", dataVerificacaoRealizada: "2024-04-10" },
      { id: 2, descricao: "Processo licitatório para aquisição dos equipamentos", statusVerificacao: StatusVerificacao.Pendente, dataVerificacaoPrevista: "2024-07-30" },
      { id: 3, descricao: "Instalação e configuração dos novos equipamentos", statusVerificacao: StatusVerificacao.Pendente, dataVerificacaoPrevista: "2025-02-28" },
    ],
    aquisicoes: [
      { id: 1, tipoAnexo: TipoAnexo.MaterialPermanente, descricaoItem: "Computador Desktop Alta Performance", quantidade: "30", unidadeMedida: "un", valorUnitarioEstimado: "450000", valorTotalEstimado: "13500000", justificativa: "Para aulas de desenvolvimento e simulação." },
      { id: 2, tipoAnexo: TipoAnexo.Software, descricaoItem: "Licenças de Software de Modelagem 3D", quantidade: "15", unidadeMedida: "lic", valorUnitarioEstimado: "120000", valorTotalEstimado: "1800000", justificativa: "Essencial para cursos de Design e Jogos." },
    ],
    situacoesProblema: ["Defasagem tecnológica dos laboratórios.", "Aumento da demanda por recursos computacionais."],
    objetivosInstitucionaisReferenciados: "Melhorar a infraestrutura de TI; Apoiar a inovação no ensino.",
    obrigatorioInclusao: false,
    obrigatorioSustentabilidade: true,
    origemDemanda: "Relatório CPA",
    anoPGA: 2024,
  },
  {
    id: 2,
    tema: "Implementação de Programa de Mentoria Estudantil",
    nomeProjeto: "Conecta FATEC",
    statusAcao: "Planejado",
    progresso: 10,
    dataInicio: "2024-08-01",
    dataFinal: "2025-12-31",
    oQueSeraFeito: "Desenvolver e implementar um programa de mentoria para conectar alunos experientes (mentores) com calouros e alunos com dificuldades (mentorados), oferecendo orientação acadêmica, profissional e pessoal.",
    porQueSeraFeito: "Reduzir a evasão escolar, melhorar o desempenho acadêmico dos alunos e promover um ambiente de maior colaboração e suporte mútuo na instituição.",
    eixoTematico: {id: mockEixos[0].id, nome: mockEixos[0].nome},
    prioridadeAcao: {id: mockPrioridades[1].id, descricao: mockPrioridades[1].descricao},
    pessoas: [mockPessoasCadastradas[3], mockPessoasCadastradas[4], mockPessoasCadastradas[2]],
    etapas: [
      { id: 1, descricao: "Definição da metodologia e material de apoio", statusVerificacao: StatusVerificacao.Pendente, dataVerificacaoPrevista: "2024-09-30" },
      { id: 2, descricao: "Capacitação dos mentores", statusVerificacao: StatusVerificacao.Pendente, dataVerificacaoPrevista: "2024-11-15" },
      { id: 3, descricao: "Lançamento do programa e pareamento inicial", statusVerificacao: StatusVerificacao.Pendente, dataVerificacaoPrevista: "2025-02-01" },
    ],
    objetivosInstitucionaisReferenciados: "Aumentar o sucesso e permanência dos estudantes.",
    obrigatorioInclusao: true,
    obrigatorioSustentabilidade: false,
    origemDemanda: "Sugestão NDE",
    anoPGA: 2024,
  },
];

const formatCurrencyForDisplay = (value?: string): string => {
  if (value === undefined || value === null) return "R$ 0,00";
  const number = parseFloat(value.replace(/[^\d]/g, '')) / 100;
  if (isNaN(number)) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(number);
};

export const Projects = (): JSX.Element => {
  const [expandedProjectId, setExpandedProjectId] = React.useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const handleEdit = (event: React.MouseEvent, projectId: number) => {
    event.stopPropagation();
    // TODO: Implement edit functionality
    console.log(`Edit project ${projectId}`);
  };

  const getStatusColor = (status: DisplayableAcaoProjeto["statusAcao"]) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Planejado":
        return "bg-yellow-100 text-yellow-800";
      case "Concluído":
        return "bg-green-100 text-green-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      case "Pendente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Ações e Projetos do PGA
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-white-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Lista de Ações/Projetos ({projectsData.length})
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {projectsData.map((project) => {
              const isExpanded = expandedProjectId === project.id;
              const responsaveis = project.pessoas.filter(p => p.papel === PapelProjeto.Responsavel);
              const colaboradores = project.pessoas.filter(p => p.papel === PapelProjeto.Colaborador);

              return (
                <div
                  key={project.id}
                  className="border rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <div
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-800">{project.tema}</h3>
                        {project.nomeProjeto && <p className="text-md text-gray-500">{project.nomeProjeto}</p>}
                         <p className="text-gray-600 mt-1 text-sm">
                          Prazo Final: {new Date(project.dataFinal).toLocaleDateString()}
                        </p>
                        <div className="mt-2 text-sm">
                            <p><span className="font-semibold">Eixo Temático:</span> {project.eixoTematico.nome}</p>
                            <p><span className="font-semibold">Prioridade:</span> {project.prioridadeAcao.descricao}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${getStatusColor(project.statusAcao)}`}
                        >
                          {project.statusAcao}
                        </span>
                        <button
                          onClick={(e) => handleEdit(e, project.id)}
                          className="flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          Editar
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-3">
                        <p className="text-sm text-gray-700"><span className="font-semibold">O que será feito:</span> {project.oQueSeraFeito.substring(0,150)}{project.oQueSeraFeito.length > 150 ? "..." : ""}</p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Progresso</span>
                        <span className="text-sm text-gray-600">
                          {project.progresso}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-[#ae0f0a] h-2.5 rounded-full"
                          style={{ width: `${project.progresso}%` }}
                        ></div>
                      </div>
                    </div>
                     <div className="mt-3">
                        <h5 className="text-sm font-semibold text-gray-700">Responsável(eis):</h5>
                        <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
                            {responsaveis.length > 0 ? responsaveis.map(r => <li key={r.pessoaId}>{r.nome}</li>) : <li>Não definido</li>}
                        </ul>
                    </div>
                  </div>
                  
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                     <div className="border-t p-4 bg-gray-50 space-y-4">
                       <div>
                         <h4 className="font-semibold text-md mb-1">Detalhes da Ação/Projeto:</h4>
                         {project.anoPGA && <p className="text-sm text-gray-700"><span className="font-medium">Ano PGA:</span> {project.anoPGA}</p>}
                         <p className="text-sm text-gray-700"><span className="font-medium">Data de Início:</span> {new Date(project.dataInicio).toLocaleDateString()}</p>
                         {project.origemDemanda && <p className="text-sm text-gray-700"><span className="font-medium">Origem da Demanda:</span> {project.origemDemanda}</p>}
                       </div>

                       {project.porQueSeraFeito && (
                        <div>
                           <h4 className="font-semibold text-md mb-1">Justificativa (Por que será feito):</h4>
                           <p className="text-gray-700 text-sm">{project.porQueSeraFeito}</p>
                        </div>
                       )}

                       {project.objetivosInstitucionaisReferenciados && (
                        <div>
                           <h4 className="font-semibold text-md mb-1">Objetivos Institucionais Referenciados:</h4>
                           <p className="text-gray-700 text-sm">{project.objetivosInstitucionaisReferenciados}</p>
                        </div>
                       )}

                       <div className="flex space-x-4">
                           {project.obrigatorioInclusao && <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Promove Inclusão</span>}
                           {project.obrigatorioSustentabilidade && <span className="text-sm font-medium text-teal-700 bg-teal-100 px-2 py-1 rounded">Promove Sustentabilidade</span>}
                       </div>
                       
                       {colaboradores.length > 0 && (
                        <div>
                           <h4 className="font-semibold text-md mb-1">Colaboradores:</h4>
                           <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                             {colaboradores.map((colaborador) => (
                               <li key={colaborador.pessoaId}>
                                 {colaborador.nome}
                                 {colaborador.cargaHorariaSemanal && ` (${colaborador.cargaHorariaSemanal}h/sem - ${colaborador.tipoVinculoHAE !== TipoVinculoHAE.NaoSeAplica ? `HAE ${colaborador.tipoVinculoHAE}` : 'Outro'})`}
                               </li>
                             ))}
                           </ul>
                        </div>
                       )}

                       {project.etapas && project.etapas.length > 0 && (
                         <div>
                           <h4 className="font-semibold text-md mb-2">Etapas do Projeto:</h4>
                           <div className="space-y-3">
                             {project.etapas.map((etapa) => (
                               <div key={etapa.id} className="p-3 bg-white rounded-md shadow-sm border">
                                 <p className="font-medium text-gray-800">{etapa.descricao}</p>
                                 <p className="text-xs text-gray-500">Status: <span className={`font-semibold ${etapa.statusVerificacao === StatusVerificacao.OK ? 'text-green-600' : etapa.statusVerificacao === StatusVerificacao.Pendente ? 'text-yellow-600' : 'text-red-600'}`}>{etapa.statusVerificacao}</span></p>
                                 {etapa.dataVerificacaoPrevista && <p className="text-xs text-gray-500">Previsto: {new Date(etapa.dataVerificacaoPrevista).toLocaleDateString()}</p>}
                                 {etapa.dataVerificacaoRealizada && <p className="text-xs text-gray-500">Realizado: {new Date(etapa.dataVerificacaoRealizada).toLocaleDateString()}</p>}
                                 {etapa.entregavelLinkSei && <p className="text-xs text-blue-500 hover:underline"><a href={etapa.entregavelLinkSei} target="_blank" rel="noopener noreferrer">Link SEI</a></p>}
                                 {etapa.numeroRef && <p className="text-xs text-gray-500">Ref: {etapa.numeroRef}</p>}
                               </div>
                             ))}
                           </div>
                         </div>
                       )}

                       {project.aquisicoes && project.aquisicoes.length > 0 && (
                         <div>
                           <h4 className="font-semibold text-md mb-2">Aquisições Previstas:</h4>
                           <div className="space-y-2">
                             {project.aquisicoes.map((item) => (
                               <div key={item.id} className="p-3 bg-white rounded-md shadow-sm border text-sm">
                                 <p className="font-medium">{item.descricaoItem} ({item.tipoAnexo.replace(/([A-Z])/g, ' $1').trim()})</p>
                                 <p>Qtd: {item.quantidade} {item.unidadeMedida || ''} - Custo Unit.: {formatCurrencyForDisplay(item.valorUnitarioEstimado)}</p>
                                 <p>Total Estimado: {formatCurrencyForDisplay(item.valorTotalEstimado)}</p>
                                 {item.justificativa && <p className="text-xs text-gray-600 mt-1">Justificativa: {item.justificativa}</p>}
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                       
                       {project.situacoesProblema && project.situacoesProblema.length > 0 && (
                         <div>
                           <h4 className="font-semibold text-md mb-1">Situação Problema / Oportunidade de Melhoria Associada:</h4>
                           <ul className="list-disc list-inside text-gray-700 text-sm ml-4">
                             {project.situacoesProblema.map((situacao, index) => (
                               <li key={index}>{situacao}</li>
                             ))}
                           </ul>
                         </div>
                       )}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};