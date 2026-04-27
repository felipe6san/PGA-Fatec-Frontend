import { useEffect, useState } from 'react';
import { pgaService } from '@/services/pgaService';
import type { PgaComUnidade } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { authService } from '@/features/auth/services/authService';
import {
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  Eye,
} from 'lucide-react';
import { STATUS_LABEL, STATUS_CLASS } from '../constants';

export function RegionalPgaView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pgas, setPgas] = useState<PgaComUnidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<{ pgaId: string; action: 'aprovar' | 'reprovar' } | null>(null);
  const [parecer, setParecer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState<string | null>(null);
  const [exportingCsv, setExportingCsv] = useState<string | null>(null);

  // sub-tela de detalhe
  const [viewingPga, setViewingPga] = useState<PgaComUnidade | null>(null);
  const [viewingProjects, setViewingProjects] = useState<any[]>([]);
  const [loadingView, setLoadingView] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'aguardando' | 'outros'>('aguardando');

  async function load() {
    setLoading(true);
    try {
      if (!user?.active_context || user.active_context.tipo !== 'regional') {
        await authService.selectContext({ tipo: 'regional', id: String(user?.pessoa_id) });
      }
      const resp = await api.get<PgaComUnidade[]>(API_ENDPOINTS.REGIONAL_PGAS);
      setPgas((resp.data ?? []).filter((p) => !p.is_template).sort((a, b) => b.ano - a.ano));
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os PGAs.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleViewPga(pga: PgaComUnidade) {
    setViewingPga(pga);
    setViewingProjects([]);
    setExpandedProjectId(null);
    setLoadingView(true);
    try {
      const resp = await api.get<any[]>(`${API_ENDPOINTS.REGIONAL_PROJETOS}?pgaId=${pga.pga_id}`);
      setViewingProjects(resp.data ?? []);
    } catch (err: any) {
      console.error('[RegionalPgaView] erro ao buscar projetos:', err?.response?.status, err?.response?.data);
      toast({ title: 'Erro ao carregar projetos', description: err?.response?.data?.message ?? String(err), variant: 'destructive' });
    } finally {
      setLoadingView(false);
    }
  }

  function handleBack() {
    setViewingPga(null);
    setViewingProjects([]);
    setExpandedProjectId(null);
  }

  async function handleExportPdf(pga: PgaComUnidade) {
    setExportingPdf(pga.pga_id);
    try {
      const blob = await pgaService.exportPdf(pga.pga_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pga-${pga.unidade?.nome_unidade ?? pga.pga_id}-${pga.ano}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível exportar o PDF.', variant: 'destructive' });
    } finally {
      setExportingPdf(null);
    }
  }

  async function handleExportCsv(pga: PgaComUnidade) {
    setExportingCsv(pga.pga_id);
    try {
      const blob = await pgaService.exportCsv(pga.pga_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pga-${pga.unidade?.nome_unidade ?? pga.pga_id}-${pga.ano}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível exportar o CSV.', variant: 'destructive' });
    } finally {
      setExportingCsv(null);
    }
  }

  async function handleReview(pgaId: string, action: 'aprovar' | 'reprovar') {
    if (action === 'reprovar' && !parecer.trim()) {
      toast({ title: 'Parecer obrigatório', description: 'Informe o parecer para reprovar o PGA.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await api.patch(`${API_ENDPOINTS.REGIONAL_PGAS}/${pgaId}/avaliacao`, {
        status: action === 'aprovar' ? 'Aprovado' : 'Reprovado',
        parecer: parecer.trim() || undefined,
      });
      toast({ title: action === 'aprovar' ? 'PGA aprovado!' : 'PGA reprovado', description: 'Avaliação registrada com sucesso.' });
      setReviewing(null);
      setParecer('');
      setViewingPga(null);
      load();
    } catch (err: any) {
      toast({ title: 'Erro', description: err?.response?.data?.message ?? 'Não foi possível registrar a avaliação.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  // Sub-tela: detalhe do PGA
  if (viewingPga) {
    return (
      <div className="p-6 space-y-6">
        {/* Voltar discreto */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para PGAs das Unidades
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {viewingPga.unidade?.nome_unidade ?? 'Unidade'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              PGA {viewingPga.ano}{viewingPga.versao ? ` · v${viewingPga.versao}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CLASS[viewingPga.status]}`}>
              {STATUS_LABEL[viewingPga.status]}
            </span>
            {viewingPga.status === 'Submetido' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white gap-1"
                  onClick={() => { setReviewing({ pgaId: viewingPga.pga_id, action: 'aprovar' }); setParecer(''); }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
                  onClick={() => { setReviewing({ pgaId: viewingPga.pga_id, action: 'reprovar' }); setParecer(''); }}
                >
                  Reprovar
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportCsv(viewingPga)}
              disabled={exportingCsv === viewingPga.pga_id}
              className="gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              {exportingCsv === viewingPga.pga_id ? 'Exportando...' : 'CSV'}
            </Button>
            <Button
              size="sm"
              onClick={() => handleExportPdf(viewingPga)}
              disabled={exportingPdf === viewingPga.pga_id}
              className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              {exportingPdf === viewingPga.pga_id ? 'Gerando...' : 'PDF'}
            </Button>
          </div>
        </div>

        {/* Cards de informações rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {viewingPga.unidade?.diretor && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-0.5">Diretor(a)</p>
              <p className="text-sm font-semibold text-gray-800">{viewingPga.unidade.diretor.nome}</p>
            </div>
          )}
          {viewingPga.data_limite_submissao && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-0.5">Prazo de Submissão</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(viewingPga.data_limite_submissao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-0.5">Projetos</p>
            <p className="text-sm font-semibold text-gray-800">
              {loadingView ? '...' : viewingProjects.length}
            </p>
          </div>
        </div>

        {/* Análise de cenário */}
        {viewingPga.analise_cenario && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Análise de Cenário</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingPga.analise_cenario}</p>
          </div>
        )}

        {/* Pareceres */}
        {viewingPga.parecer_regional && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Parecer Regional</p>
            <p className="text-sm text-green-800 whitespace-pre-wrap">{viewingPga.parecer_regional}</p>
          </div>
        )}
        {viewingPga.parecer_cps && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Parecer CPS</p>
            <p className="text-sm text-blue-800 whitespace-pre-wrap">{viewingPga.parecer_cps}</p>
          </div>
        )}

        {/* Projetos / Ações */}
        <div>
          <p className="text-base font-semibold text-gray-900 mb-3">
            Projetos / Ações {!loadingView && `(${viewingProjects.length})`}
          </p>
          {loadingView ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#ae0f0a]" />
            </div>
          ) : viewingProjects.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhum projeto cadastrado neste PGA.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {viewingProjects.map((proj: any) => {
                const isProjExpanded = expandedProjectId === proj.acao_projeto_id;
                return (
                  <div key={proj.acao_projeto_id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedProjectId(isProjExpanded ? null : proj.acao_projeto_id)}
                    >
                      {proj.codigo_projeto && (
                        <span className="flex-shrink-0 text-xs font-bold text-[#ae0f0a] bg-[#ae0f0a]/10 rounded px-2 py-0.5">
                          {proj.codigo_projeto}
                        </span>
                      )}
                      <span className="flex-1 min-w-0 text-sm font-medium text-gray-800 truncate">
                        {proj.nome_projeto ?? 'Projeto sem nome'}
                      </span>
                      {isProjExpanded
                        ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                    </button>

                    {isProjExpanded && (
                      <div className="border-t border-gray-100 px-5 py-5 space-y-4 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                          {proj.eixo?.nome_eixo && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2.5 py-1 font-medium">
                              {proj.eixo.nome_eixo}
                            </span>
                          )}
                          {proj.tema?.nome_tema && (
                            <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2.5 py-1 font-medium">
                              {proj.tema.nome_tema}
                            </span>
                          )}
                          {proj.prioridade && (
                            <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2.5 py-1 font-medium">
                              Prioridade {proj.prioridade.grau}
                              {proj.prioridade.descricao ? `: ${proj.prioridade.descricao}` : ''}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {proj.data_inicio && (
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Início</p>
                              <p className="text-sm font-medium text-gray-700">
                                {new Date(proj.data_inicio).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                          {proj.data_final && (
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Término</p>
                              <p className="text-sm font-medium text-gray-700">
                                {new Date(proj.data_final).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                          {proj.custo_total_estimado != null && (
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Custo Estimado</p>
                              <p className="text-sm font-medium text-gray-700">
                                {Number(proj.custo_total_estimado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </p>
                            </div>
                          )}
                        </div>

                        {proj.fonte_recursos && (
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Fonte de Recursos</p>
                            <p className="text-sm text-gray-700">{proj.fonte_recursos}</p>
                          </div>
                        )}
                        {proj.o_que_sera_feito && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">O que será feito</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{proj.o_que_sera_feito}</p>
                          </div>
                        )}
                        {proj.por_que_sera_feito && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Por que será feito</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{proj.por_que_sera_feito}</p>
                          </div>
                        )}
                        {proj.objetivos_institucionais_referenciados && (
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Objetivos Institucionais Referenciados</p>
                            <p className="text-sm text-gray-700">{proj.objetivos_institucionais_referenciados}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de avaliação na tela de detalhe */}
        {reviewing && (
          <Modal
            isOpen={!!reviewing}
            onClose={() => { setReviewing(null); setParecer(''); }}
            title={reviewing.action === 'aprovar' ? 'Confirmar Aprovação' : 'Confirmar Reprovação'}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {reviewing.action === 'aprovar'
                  ? 'Confirma a aprovação deste PGA? O parecer é opcional.'
                  : 'Informe o motivo da reprovação (obrigatório).'}
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]/30"
                rows={3}
                placeholder={reviewing.action === 'aprovar' ? 'Observações (opcional)...' : 'Motivo da reprovação...'}
                value={parecer}
                onChange={(e) => setParecer(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setReviewing(null); setParecer(''); }} disabled={submitting}>
                  Cancelar
                </Button>
                <Button
                  className={reviewing.action === 'aprovar' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#ae0f0a] hover:bg-[#8e0c08] text-white'}
                  onClick={() => handleReview(reviewing.pgaId, reviewing.action)}
                  disabled={submitting}
                >
                  {submitting ? 'Salvando...' : reviewing.action === 'aprovar' ? 'Confirmar Aprovação' : 'Confirmar Reprovação'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // Lista de PGAs
  const pgasAguardando = pgas.filter((p) => p.status === 'Submetido');
  const pgasOutros = pgas.filter((p) => p.status !== 'Submetido');
  const tabPgas = activeTab === 'aguardando' ? pgasAguardando : pgasOutros;

  function PgaCard({ pga }: { pga: PgaComUnidade }) {
    const isExpanded = expandedId === pga.pga_id;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {pga.unidade?.nome_unidade ?? pga.unidade_id}
            </p>
            <p className="text-sm text-gray-500">
              Ano {pga.ano}{pga.versao ? ` · v${pga.versao}` : ''}
              {pga.data_limite_submissao && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Limite: {new Date(pga.data_limite_submissao).toLocaleDateString('pt-BR')}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CLASS[pga.status]}`}>
              {STATUS_LABEL[pga.status]}
            </span>
            <Button size="sm" variant="outline" onClick={() => handleViewPga(pga)} className="gap-1">
              <Eye className="h-3.5 w-3.5" />
              Visualizar
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportPdf(pga)} disabled={exportingPdf === pga.pga_id} className="gap-1">
              <Download className="h-3.5 w-3.5" />
              {exportingPdf === pga.pga_id ? 'Gerando...' : 'PDF'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportCsv(pga)} disabled={exportingCsv === pga.pga_id} className="gap-1">
              <Download className="h-3.5 w-3.5" />
              {exportingCsv === pga.pga_id ? 'Gerando...' : 'CSV'}
            </Button>
          </div>
        </div>
        {pga.status === 'Reprovado' && pga.parecer_regional && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
            <p className="font-semibold mb-1">Parecer registrado:</p>
            <p>{pga.parecer_regional}</p>
          </div>
        )}
        {isExpanded && pga.analise_cenario && (
          <div className="border-t border-gray-100 px-6 py-4 bg-blue-50">
            <p className="text-sm font-semibold text-blue-800 mb-1">Análise de Cenário:</p>
            <p className="text-sm text-blue-700 whitespace-pre-line">{pga.analise_cenario}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PGAs das Unidades</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Acompanhe e avalie os PGAs submetidos pelas unidades da sua regional.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-1">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('aguardando')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'aguardando'
              ? 'border-[#ae0f0a] text-[#ae0f0a]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Aguardando Avaliação
          {pgasAguardando.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-[#ae0f0a] text-white">
              {pgasAguardando.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('outros')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'outros'
              ? 'border-[#ae0f0a] text-[#ae0f0a]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Em Elaboração / Outros
          {pgasOutros.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-gray-200 text-gray-600">
              {pgasOutros.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a]" />
        </div>
      ) : tabPgas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            {activeTab === 'aguardando'
              ? 'Nenhum PGA aguardando avaliação.'
              : 'Nenhum PGA em elaboração.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tabPgas.map((pga) => <PgaCard key={pga.pga_id} pga={pga} />)}
        </div>
      )}

      {/* Modal de confirmação de avaliação (lista) */}
      {reviewing && (
        <Modal
          isOpen={!!reviewing}
          onClose={() => { setReviewing(null); setParecer(''); }}
          title={reviewing.action === 'aprovar' ? 'Confirmar Aprovação' : 'Confirmar Reprovação'}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {reviewing.action === 'aprovar'
                ? 'Confirma a aprovação deste PGA? O parecer é opcional.'
                : 'Informe o motivo da reprovação (obrigatório).'}
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]/30"
              rows={3}
              placeholder={reviewing.action === 'aprovar' ? 'Observações (opcional)...' : 'Motivo da reprovação...'}
              value={parecer}
              onChange={(e) => setParecer(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setReviewing(null); setParecer(''); }} disabled={submitting}>
                Cancelar
              </Button>
              <Button
                className={reviewing.action === 'aprovar' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#ae0f0a] hover:bg-[#8e0c08] text-white'}
                onClick={() => handleReview(reviewing.pgaId, reviewing.action)}
                disabled={submitting}
              >
                {submitting ? 'Salvando...' : reviewing.action === 'aprovar' ? 'Confirmar Aprovação' : 'Confirmar Reprovação'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
