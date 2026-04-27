import { useEffect, useState } from 'react';
import { pgaService } from '@/services/pgaService';
import type { PgaComUnidade, PublishPgaResult } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { SummaryCard } from './SummaryCard';
import { TemplateRow } from './TemplateRow';
import { CreatePgaModal } from './CreatePgaModal';
import { EditPgaModal } from './EditPgaModal';
import { PublishConfirmModal } from './PublishConfirmModal';

export function AdminPgaView() {
  const { toast } = useToast();
  const [pgas, setPgas] = useState<PgaComUnidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [publishTarget, setPublishTarget] = useState<PgaComUnidade | null>(null);
  const [editTarget, setEditTarget] = useState<PgaComUnidade | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await pgaService.getAll();
      setPgas(data);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os PGAs.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const templates = pgas.filter((p) => p.is_template);
  const copies = pgas.filter((p) => !p.is_template);

  function getCopiesForTemplate(templateId: string) {
    return copies.filter((c) => c.template_pga_id === templateId);
  }

  async function handlePublish() {
    if (!publishTarget) return;
    setPublishing(true);
    try {
      const result: PublishPgaResult = await pgaService.publish(publishTarget.pga_id);
      toast({
        title: 'PGA Liberado!',
        description: `${result.copias_geradas} cópia(s) criada(s) para as unidades.`,
      });
      setPublishTarget(null);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Não foi possível publicar o PGA.';
      toast({ title: 'Erro ao publicar', description: msg, variant: 'destructive' });
    } finally {
      setPublishing(false);
    }
  }

  const publishedCount = templates.filter((p) => p.status === 'Publicado').length;
  const draftCount = templates.filter((p) => p.status === 'EmElaboracao').length;

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de PGAs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Crie, configure e libere os PGAs para as unidades.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Novo PGA
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Templates" value={templates.length} color="blue" icon="📋" />
        <SummaryCard label="Em Elaboração" value={draftCount} color="yellow" icon="✏️" />
        <SummaryCard label="Publicados" value={publishedCount} color="green" icon="✅" />
        <SummaryCard label="Cópias Geradas" value={copies.length} color="purple" icon="📄" />
      </div>

      {/* Tabela de templates */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Templates PGA</h2>
          <span className="text-xs text-gray-400">{templates.length} template(s)</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">Nenhum PGA template cadastrado ainda.</p>
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="mt-3 bg-[#ae0f0a] hover:bg-[#8e0c08] text-white gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Criar primeiro PGA
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Versão
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Data Limite
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Unidades
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates
                  .sort((a, b) => b.ano - a.ano)
                  .map((pga) => (
                    <TemplateRow
                      key={pga.pga_id}
                      pga={pga}
                      onPublish={setPublishTarget}
                      onEdit={setEditTarget}
                      unidadeCopias={getCopiesForTemplate(pga.pga_id)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreatePgaModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />
      <PublishConfirmModal
        pga={publishTarget}
        onClose={() => setPublishTarget(null)}
        onConfirm={handlePublish}
        loading={publishing}
      />
      <EditPgaModal
        pga={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={load}
      />
    </div>
  );
}
