import { useEffect, useState } from 'react';
import { pgaService } from '@/services/pgaService';
import type { PgaComUnidade } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface EditPgaModalProps {
  pga: PgaComUnidade | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditPgaModal({ pga, onClose, onUpdated }: EditPgaModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ versao: '', analise_cenario: '', data_limite_submissao: '' });

  useEffect(() => {
    if (pga) {
      setForm({
        versao: pga.versao ?? '',
        analise_cenario: pga.analise_cenario ?? '',
        data_limite_submissao: pga.data_limite_submissao
          ? new Date(pga.data_limite_submissao).toISOString().split('T')[0]
          : '',
      });
    }
  }, [pga]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pga) return;
    setLoading(true);
    try {
      await pgaService.update(pga.pga_id, {
        versao: form.versao || undefined,
        analise_cenario: form.analise_cenario || undefined,
        data_limite_submissao: form.data_limite_submissao
          ? new Date(form.data_limite_submissao + 'T00:00:00.000Z').toISOString()
          : undefined,
      });
      toast({ title: 'PGA atualizado', description: 'Template salvo com sucesso.' });
      onUpdated();
      onClose();
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o PGA.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  if (!pga) return null;

  return (
    <Modal isOpen={!!pga} onClose={onClose} title={`Editar Template PGA ${pga.ano}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Versão</label>
            <input
              type="text"
              maxLength={10}
              value={form.versao}
              onChange={(e) => setForm((f) => ({ ...f, versao: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Limite</label>
            <input
              type="date"
              value={form.data_limite_submissao}
              onChange={(e) => setForm((f) => ({ ...f, data_limite_submissao: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Análise do Cenário
          </label>
          <textarea
            rows={3}
            value={form.analise_cenario}
            onChange={(e) => setForm((f) => ({ ...f, analise_cenario: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a] resize-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
