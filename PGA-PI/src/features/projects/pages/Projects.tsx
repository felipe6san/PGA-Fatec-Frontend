import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";
import { useEffect, useState } from "react";
import { projectService } from '../services/projectService';
import { anexoService } from '../../anexos/services/anexoService';
import { AcaoProjeto, Attachment } from '@/types/api';

const formatCurrencyForDisplay = (value?: number): string => {
  if (value === undefined || value === null) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const Projects = (): JSX.Element => {
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [projetos, setProjetos] = useState<AcaoProjeto[]>([]);
  const [anexos, setAnexos] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projetosData, anexosData] = await Promise.all([
          projectService.getAll(),
          anexoService.getAll()
        ]);
        setProjetos(projetosData);
        setAnexos(anexosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar projetos e anexos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const handleEdit = (event: React.MouseEvent, projectId: number) => {
    event.stopPropagation();
    // TODO: Implement edit functionality
    console.log(`Edit project ${projectId}`);
  };

  const getStatusColor = () => {
    return "bg-blue-100 text-blue-800";
  };

  const calculateProgress = (project: AcaoProjeto): number => {
    if (!project.data_inicio || !project.data_final) return 0;
    
    const now = new Date();
    const start = new Date(project.data_inicio);
    const end = new Date(project.data_final);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.round((elapsed / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando projetos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Ações e Projetos do PGA
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-white-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Lista de Ações/Projetos ({projetos.length})
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {projetos.length > 0 ? (
              projetos.map((project) => {
                const isExpanded = expandedProjectId === project.acao_projeto_id;
                const progresso = calculateProgress(project);

                return (
                  <div
                    key={project.acao_projeto_id}
                    className="border rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                  >
                    <div
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(project.acao_projeto_id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-800">{project.tema?.descricao || 'Sem tema'}</h3>
                            <p className="text-gray-600 mt-1 text-sm">
                            Prazo Final: {project.data_final ? new Date(project.data_final).toLocaleDateString() : 'Não definido'}
                          </p>
                          <div className="mt-2 text-sm">
                            <p><span className="font-semibold">Eixo Temático:</span> {project.eixo?.nome_eixo || 'N/A'}</p>
                            <p><span className="font-semibold">Prioridade:</span> {project.prioridade?.descricao || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${getStatusColor()}`}
                          >
                            Em Andamento
                          </span>
                          <button
                            onClick={(e) => handleEdit(e, project.acao_projeto_id)}
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
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">O que será feito:</span> {project.o_que_sera_feito.substring(0,150)}{project.o_que_sera_feito.length > 150 ? "..." : ""}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Progresso</span>
                          <span className="text-sm text-gray-600">
                            {progresso}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#ae0f0a] h-2.5 rounded-full"
                            style={{ width: `${progresso}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="border-t p-4 bg-gray-50 space-y-4">
                        <div>
                          <h4 className="font-semibold text-md mb-1">Detalhes da Ação/Projeto:</h4>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Data de Início:</span> {project.data_inicio ? new Date(project.data_inicio).toLocaleDateString() : 'Não definida'}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">PGA ID:</span> {project.pga_id}
                          </p>
                        </div>

                        {project.por_que_sera_feito && (
                          <div>
                            <h4 className="font-semibold text-md mb-1">Justificativa (Por que será feito):</h4>
                            <p className="text-gray-700 text-sm">{project.por_que_sera_feito}</p>
                          </div>
                        )}

                        {project.objetivos_institucionais_referenciados && (
                          <div>
                            <h4 className="font-semibold text-md mb-1">Objetivos Institucionais Referenciados:</h4>
                            <p className="text-gray-700 text-sm">{project.objetivos_institucionais_referenciados}</p>
                          </div>
                        )}

                        <div className="flex space-x-4">
                          {project.obrigatorio_inclusao && <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Promove Inclusão</span>}
                          {project.obrigatorio_sustentabilidade && <span className="text-sm font-medium text-teal-700 bg-teal-100 px-2 py-1 rounded">Promove Sustentabilidade</span>}
                        </div>

                        {project.etapas && anexos
                          .filter(anexo =>
                            project.etapas?.some(etapa => etapa.etapa_id === anexo.etapa_processo_id)
                          )
                          .length > 0 && (
                          <div>
                            <h4 className="font-semibold text-md mb-2">Anexos/Aquisições:</h4>
                            <div className="space-y-2">
                              {anexos
                                .filter(anexo =>
                                  project.etapas?.some(etapa => etapa.etapa_id === anexo.etapa_processo_id)
                                )
                                .map(anexo => (
                                  <div key={anexo.anexo_id} className="p-3 bg-white rounded-md shadow-sm border text-sm">
                                    <p className="font-medium">{anexo.item}</p>
                                    <p className="text-gray-600">{anexo.descricao}</p>
                                    <p>Qtd: {anexo.quantidade} - Preço Total: {formatCurrencyForDisplay(anexo.preco_total_estimado)}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Nenhum projeto encontrado</p>
                <p className="text-gray-400 text-sm mt-2">Verifique se o backend está rodando e se há projetos cadastrados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};