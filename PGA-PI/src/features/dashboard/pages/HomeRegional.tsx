import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/cardDashboard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { ProjectProgressCard } from '../components/ProjectProgressCard';
import { Building2, Users, FileText, Target, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/features/auth/services/authService';
import type { PgaComUnidade, AcaoProjeto, StatusPGA } from '@/types/api';
import { buildProjectCards } from '../utils/transformers';

const STATUS_LABEL: Record<StatusPGA, string> = {
  EmElaboracao: 'Em Elaboração',
  Publicado: 'Publicado',
  Submetido: 'Submetido',
  Aprovado: 'Aprovado pela Regional',
  AguardandoCPS: 'Aguardando CPS',
  AprovadoCPS: 'Aprovado pelo CPS',
  Reprovado: 'Reprovado',
};

const STATUS_CLASS: Record<StatusPGA, string> = {
  EmElaboracao: 'bg-yellow-100 text-yellow-800',
  Publicado: 'bg-blue-100 text-blue-800',
  Submetido: 'bg-purple-100 text-purple-800',
  Aprovado: 'bg-green-100 text-green-800',
  AguardandoCPS: 'bg-orange-100 text-orange-800',
  AprovadoCPS: 'bg-green-200 text-green-900',
  Reprovado: 'bg-red-100 text-red-800',
};

const TIPO_LABEL: Record<string, string> = {
  Diretor: 'Diretor(a)',
  Coordenador: 'Coordenador(a)',
  Docente: 'Docente',
  Administrativo: 'Administrativo',
  Administrador: 'Administrador',
  CPS: 'CPS',
  Regional: 'Regional',
};

interface Unidade {
  unidade_id: string;
  codigo_fnnn: string;
  nome_unidade: string;
}

interface RegionalInfo {
  regional_id: string;
  nome_regional: string;
  codigo_regional?: string | null;
  unidades: Unidade[];
}

interface PessoaBasica {
  pessoa_id: string;
  nome: string;
  email?: string | null;
  tipo_usuario: string;
}

export const HomeRegional = (): JSX.Element => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pgas');
  const [regionalInfo, setRegionalInfo] = useState<RegionalInfo | null>(null);
  const [allPgas, setAllPgas] = useState<PgaComUnidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Equipe tab
  const [pessoasPorUnidade, setPessoasPorUnidade] = useState<Record<string, PessoaBasica[]>>({});
  const [teamLoaded, setTeamLoaded] = useState(false);

  // Projetos tab
  const [selectedUnidadeId, setSelectedUnidadeId] = useState('');
  const [selectedPgaId, setSelectedPgaId] = useState('');
  const [projetos, setProjetos] = useState<AcaoProjeto[]>([]);
  const [loadingProjetos, setLoadingProjetos] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !user) return;
    initialized.current = true;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user.active_context || user.active_context.tipo !== 'regional') {
          await authService.selectContext({ tipo: 'regional', id: String(user.pessoa_id) });
          await refreshUser();
        }

        const [infoResp, pgasResp] = await Promise.all([
          api.get<RegionalInfo>(API_ENDPOINTS.REGIONAL_UNIDADES),
          api.get<PgaComUnidade[]>(API_ENDPOINTS.REGIONAL_PGAS),
        ]);

        setRegionalInfo(infoResp.data);
        setAllPgas(pgasResp.data ?? []);

        if (infoResp.data?.unidades?.length) {
          const results = await Promise.all(
            infoResp.data.unidades.map((u) =>
              api
                .get<PessoaBasica[]>(`${API_ENDPOINTS.USERS_BY_UNIDADE}/${u.unidade_id}`)
                .then((r) => ({ unidade_id: u.unidade_id, pessoas: r.data }))
                .catch(() => ({ unidade_id: u.unidade_id, pessoas: [] as PessoaBasica[] })),
            ),
          );
          const map: Record<string, PessoaBasica[]> = {};
          for (const r of results) map[r.unidade_id] = r.pessoas;
          setPessoasPorUnidade(map);
        }
      } catch {
        setError('Erro ao carregar dados da regional.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user]);

  // Load equipe lazily when Equipe tab opens for the first time
  useEffect(() => {
    if (activeTab !== 'team' || teamLoaded || !regionalInfo?.unidades?.length) return;

    const loadTeam = async () => {
      const results = await Promise.all(
        regionalInfo.unidades.map((u) =>
          api
            .get<PessoaBasica[]>(`${API_ENDPOINTS.USERS_BY_UNIDADE}/${u.unidade_id}`)
            .then((r) => ({ unidade_id: u.unidade_id, pessoas: r.data }))
            .catch(() => ({ unidade_id: u.unidade_id, pessoas: [] as PessoaBasica[] })),
        ),
      );
      const map: Record<string, PessoaBasica[]> = {};
      for (const r of results) map[r.unidade_id] = r.pessoas;
      setPessoasPorUnidade(map);
      setTeamLoaded(true);
    };

    loadTeam();
  }, [activeTab, teamLoaded, regionalInfo]);

  // When unit changes in Projetos tab, reset PGA and projetos
  useEffect(() => {
    setSelectedPgaId('');
    setProjetos([]);
  }, [selectedUnidadeId]);

  // Load projetos when PGA is selected
  useEffect(() => {
    if (!selectedPgaId) return;
    setLoadingProjetos(true);
    api
      .get<AcaoProjeto[]>(API_ENDPOINTS.REGIONAL_PROJETOS, { params: { pgaId: selectedPgaId } })
      .then((r) => setProjetos(r.data ?? []))
      .catch(() => setProjetos([]))
      .finally(() => setLoadingProjetos(false));
  }, [selectedPgaId]);

  // Unique units derived from allPgas (for the Projetos selector)
  const unidadesComPga = Array.from(
    new Map(
      allPgas.map((p) => [
        p.unidade_id,
        { id: p.unidade_id, nome: p.unidade?.nome_unidade ?? String(p.unidade_id) },
      ]),
    ).values(),
  );

  const pgasDaUnidade = allPgas.filter((p) => p.unidade_id === selectedUnidadeId);
  const projectCards = buildProjectCards(projetos);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando...</div>
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
    <div className="space-y-6">
      <h1 className="font-extrabold text-black text-2xl md:text-[32px] text-center">
        Dashboard Regional
      </h1>

      {/* Identity card */}
      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl bg-gradient-to-r from-[#ae0f0a] to-[#8e0c08] text-white">
        <CardHeader className="bg-white/10 backdrop-blur-sm rounded-t-xl py-4 md:py-6 px-6 md:px-8">
          <div className="flex items-center gap-4">
            <Building2 className="w-8 h-8 text-white" />
            <h2 className="font-semibold text-white text-xl md:text-[28px]">
              IDENTIFICAÇÃO DA REGIONAL
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <p className="font-medium text-white/80 text-base md:text-lg mb-2">Código</p>
              <p className="font-bold text-white text-2xl md:text-3xl">
                {regionalInfo?.codigo_regional ?? '—'}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-medium text-white/80 text-base md:text-lg mb-2">Regional</p>
              <p className="font-bold text-white text-2xl md:text-3xl">
                {regionalInfo?.nome_regional ?? '—'}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-medium text-white/80 text-base md:text-lg mb-2">
                Unidades vinculadas
              </p>
              <p className="font-bold text-white text-2xl md:text-3xl">
                {regionalInfo?.unidades?.length ?? '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-tab section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger
            value="pgas"
            isActive={activeTab === 'pgas'}
            onClick={() => setActiveTab('pgas')}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            PGAs
          </TabsTrigger>
          <TabsTrigger
            value="projetos"
            isActive={activeTab === 'projetos'}
            onClick={() => setActiveTab('projetos')}
          >
            <Target className="w-4 h-4 mr-1.5" />
            Projetos
          </TabsTrigger>
          <TabsTrigger
            value="team"
            isActive={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
          >
            <Users className="w-4 h-4 mr-1.5" />
            Equipe
          </TabsTrigger>
        </TabsList>

        {/* ── PGAs ── */}
        <TabsContent value="pgas" isActive={activeTab === 'pgas'}>
          {allPgas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Nenhum PGA encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allPgas.map((pga) => (
                <Card key={pga.pga_id} className="border border-gray-200 rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {pga.unidade?.nome_unidade ?? pga.unidade_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ano {pga.ano}
                          {pga.versao ? ` · v${pga.versao}` : ''}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                          STATUS_CLASS[pga.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {STATUS_LABEL[pga.status] ?? pga.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Projetos ── */}
        <TabsContent value="projetos" isActive={activeTab === 'projetos'}>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Unit selector */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Unidade</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]/30"
                    value={selectedUnidadeId}
                    onChange={(e) => setSelectedUnidadeId(e.target.value)}
                  >
                    <option value="">Selecionar unidade...</option>
                    {unidadesComPga.map((u) => (
                      <option key={String(u.id)} value={String(u.id ?? '')}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* PGA selector */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">PGA</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]/30 disabled:bg-gray-50 disabled:text-gray-400"
                    value={selectedPgaId}
                    onChange={(e) => setSelectedPgaId(e.target.value)}
                    disabled={!selectedUnidadeId}
                  >
                    <option value="">Selecionar PGA...</option>
                    {pgasDaUnidade.map((p) => (
                      <option key={p.pga_id} value={p.pga_id}>
                        Ano {p.ano}
                        {p.versao ? ` · v${p.versao}` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {!selectedPgaId ? (
              <div className="text-center py-10 text-gray-400">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Selecione uma unidade e um PGA para ver os projetos.</p>
              </div>
            ) : loadingProjetos ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a]" />
              </div>
            ) : projectCards.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum projeto cadastrado neste PGA.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectCards.map((card) => (
                  <ProjectProgressCard key={card.id} project={card} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Equipe ── */}
        <TabsContent value="team" isActive={activeTab === 'team'}>
          <div className="space-y-4">
            {!teamLoaded ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a]" />
              </div>
            ) : (
              (regionalInfo?.unidades ?? []).map((unidade) => {
                const pessoas = pessoasPorUnidade[unidade.unidade_id] ?? [];
                return (
                  <div
                    key={unidade.unidade_id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="bg-gray-50 px-5 py-3 flex items-center gap-2 border-b border-gray-200">
                      <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm">
                        {unidade.nome_unidade}{' '}
                        <span className="text-gray-400 font-normal">({unidade.codigo_fnnn})</span>
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {pessoas.length} pessoa{pessoas.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {pessoas.length === 0 ? (
                      <p className="text-sm text-gray-400 px-5 py-4">Nenhuma pessoa vinculada.</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {pessoas.map((p) => (
                          <div
                            key={p.pessoa_id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 gap-1"
                          >
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{p.nome}</p>
                              <p className="text-xs text-gray-500">{p.email ?? '-'}</p>
                            </div>
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                              {TIPO_LABEL[p.tipo_usuario] ?? p.tipo_usuario}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};