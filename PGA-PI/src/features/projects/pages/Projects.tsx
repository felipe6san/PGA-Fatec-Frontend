import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";
import { Modal } from '@/components/ui/modal';
import { pgaService } from '@/services/pgaService';
import { useEffect, useState } from "react";
import { useToast } from '@/components/ui/use-toast';
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
  const [fabOpen, setFabOpen] = useState(false);
  const [pgaModalOpen, setPgaModalOpen] = useState(false);
  const [editingPga, setEditingPga] = useState<any | null>(null);
  const [pgaForm, setPgaForm] = useState<any>({ versao: '', analise_cenario: '', data_elaboracao: '', status: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editingPga) {
      setPgaForm({
        versao: editingPga.versao ?? '',
        analise_cenario: editingPga.analise_cenario ?? '',
        data_elaboracao: editingPga.data_elaboracao ? new Date(editingPga.data_elaboracao).toISOString().split('T')[0] : '',
        data_parecer_gpr: '',
        status: editingPga.status ?? ''
      });
    }
  }, [editingPga]);

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

  const handleEditPga = async (event: React.MouseEvent, pgaId?: number | null) => {
    event.stopPropagation();
    if (!pgaId) {
      toast({ title: 'Projeto sem PGA', description: 'Projeto não possui PGA associado.', variant: 'destructive' });
      return;
    }
    try {
      const pga = await pgaService.getById(pgaId);
      setEditingPga(pga);
      setIsEditing(false);
      setPgaModalOpen(true);
    } catch (err) {
      console.error('Erro ao carregar PGA para edição:', err);
      toast({ title: 'Erro', description: 'Não foi possível carregar dados do PGA.', variant: 'destructive' });
    }
  };

  const handleSubmitPga = async (updated: any) => {
    if (!editingPga) return;
    try {
      const payload: any = {};
      if (updated.versao !== undefined && updated.versao !== '') payload.versao = updated.versao;
      if (updated.analise_cenario !== undefined && updated.analise_cenario !== '') payload.analise_cenario = updated.analise_cenario;
      const toIsoDateTime = (d: any) => {
        if (!d) return undefined;
        const dt = d instanceof Date ? d : new Date(d);
        if (Number.isNaN(dt.getTime())) return undefined;
        return dt.toISOString();
      };

      if (updated.data_elaboracao) {
        const iso = toIsoDateTime(updated.data_elaboracao);
        if (iso) payload.data_elaboracao = iso;
      }
      if (updated.status !== undefined && updated.status !== '') payload.status = updated.status;

      await projectService.updatePga(editingPga.pga_id, payload);
      setPgaModalOpen(false);
      setEditingPga(null);
      toast({ title: 'PGA atualizado', description: 'PGA atualizado com sucesso.', variant: 'success' });
      try {
        const refreshed = await projectService.getAll();
        setProjetos(refreshed);
      } catch (e) {
        console.error('Erro ao recarregar projetos após salvar PGA:', e);
      }
    } catch (err) {
      console.error('Erro ao salvar PGA:', err);
      toast({ title: 'Erro', description: 'Falha ao salvar PGA.', variant: 'destructive' });
    }
  };

  const onChangePgaField = (field: string, value: any) => {
    setPgaForm((s: any) => ({ ...s, [field]: value }));
  };

  const handleExportPdf = async (pgaId: number) => {
    try {
      await projectService.exportPgaPdf(pgaId);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro na exportação', description: 'Erro ao exportar PDF.', variant: 'destructive' });
    }
  };

  const handleExportCsv = async (pgaId: number) => {
    try {
      await projectService.exportPgaCsv(pgaId);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro na exportação', description: 'Erro ao exportar CSV.', variant: 'destructive' });
    }
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
          <div className="flex items-center space-x-2 ml-auto">
            {/* Header buttons removed — use floating PGA button */}
          </div>
        </CardHeader>
        {/* Floating Action Button container */}
        <div className="fixed right-6 bottom-6 z-50">
          <div className="flex flex-col items-end space-y-2">
            {fabOpen && (
              <div className="flex flex-col space-y-2 mb-2">
                <button
                  onClick={async () => {
                    const pgaIds = Array.from(new Set(projetos.map(p => p.pga_id).filter(Boolean)));
                    for (const id of pgaIds) {
                      try { await projectService.exportPgaPdf(id); } catch (e) { console.error(e); }
                    }
                  }}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md"
                >
                  Gerar PDF
                </button>
                <button
                  onClick={async () => {
                    const pgaIds = Array.from(new Set(projetos.map(p => p.pga_id).filter(Boolean)));
                    for (const id of pgaIds) {
                      try { await projectService.exportPgaCsv(id); } catch (e) { console.error(e); }
                    }
                  }}
                  className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-md"
                >
                  Gerar CSV
                </button>
                <button
                  onClick={(e) => handleEditPga(e as any, projetos.length > 0 ? projetos[0].pga_id : undefined)}
                  className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-md"
                >
                  Dados PGA
                </button>
              </div>
            )}

            <button
              onClick={() => setFabOpen(!fabOpen)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#ae0f0a] text-white shadow-lg hover:scale-105 transition-transform"
              title="PGA"
            >
              PGA
            </button>
          </div>
        </div>
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
                                    {/* Editar PGA button removed — use floating PGA button for PGA actions */}
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleExportPdf(project.pga_id); }}
                              title="Gerar PDF do PGA deste projeto"
                              className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                            >
                              PDF
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleExportCsv(project.pga_id); }}
                              title="Gerar CSV do PGA deste projeto"
                              className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                            >
                              CSV
                            </button>
                          </div>
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

        <Modal isOpen={pgaModalOpen} onClose={() => { setPgaModalOpen(false); setEditingPga(null); setIsEditing(false); }} title={isEditing ? "Editar PGA" : "Dados do PGA"}>
          <div className="space-y-4">
            {/* Top info row: Year, Unidade and Edit button */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano</label>
                  <div className="mt-1 text-sm text-gray-800">{editingPga?.ano ?? '-'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidade</label>
                  <div className="mt-1 text-sm text-gray-800">{editingPga?.unidade?.nome_unidade ?? editingPga?.unidade?.nome_unidade ?? '-'}</div>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    aria-label="Editar PGA"
                  >
                    Editar
                  </button>
                ) : (
                  <button className="flex items-center px-2 py-1 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed" disabled aria-label="Editando"> 
                    Editando
                  </button>
                )}
              </div>
            </div>

            {/* Form fields - present uniformly as inputs/textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <input type="text" value={editingPga?.status ?? ''} disabled className="mt-1 block w-full border rounded-md p-2 bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Versão</label>
              <input value={pgaForm.versao} onChange={(e) => onChangePgaField('versao', e.target.value)} disabled={!isEditing} className={`mt-1 block w-full border rounded-md p-2 ${!isEditing ? 'bg-gray-50' : ''}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Análise do Cenário</label>
              <textarea value={pgaForm.analise_cenario} onChange={(e) => onChangePgaField('analise_cenario', e.target.value)} rows={6} disabled={!isEditing} className={`mt-1 block w-full border rounded-md p-2 ${!isEditing ? 'bg-gray-50' : ''}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data de elaboração</label>
              <input type="date" value={pgaForm.data_elaboracao} onChange={(e) => onChangePgaField('data_elaboracao', e.target.value)} disabled={!isEditing} className={`mt-1 block w-full border rounded-md p-2 ${!isEditing ? 'bg-gray-50' : ''}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data Parecer GPR</label>
              <input type="text" value={editingPga?.data_parecer_gpr ? new Date(editingPga.data_parecer_gpr).toLocaleDateString() : ''} disabled className="mt-1 block w-full border rounded-md p-2 bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parecer Regional</label>
              <textarea value={editingPga?.parecer_regional ?? ''} rows={3} disabled className="mt-1 block w-full border rounded-md p-2 bg-gray-50" />
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing && (
                <>
                  <button onClick={() => {
                    if (editingPga) {
                      setPgaForm({
                        versao: editingPga.versao ?? '',
                        analise_cenario: editingPga.analise_cenario ?? '',
                        data_elaboracao: editingPga.data_elaboracao ? new Date(editingPga.data_elaboracao).toISOString().split('T')[0] : '',
                        status: editingPga.status ?? ''
                      });
                    }
                    setIsEditing(false);
                  }} className="px-4 py-2 bg-gray-100 rounded-md">Cancelar</button>

                  <button onClick={async () => { await handleSubmitPga(pgaForm); setIsEditing(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
                </>
              )}
            </div>
          </div>
        </Modal>
    </>
  );
};