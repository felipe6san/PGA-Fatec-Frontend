import { useState } from 'react';
import { pgaService, type CreatePgaPayload } from '@/services/pgaService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface CreatePgaModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreatePgaModal({ open, onClose, onCreated }: CreatePgaModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreatePgaPayload>({
    ano: new Date().getFullYear() + 1,
    versao: '1.0',
    analise_cenario: '',
    data_limite_submissao: '',
    is_template: true,
  });

  function handleChange(field: keyof CreatePgaPayload, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreatePgaPayload = {
        ...form,
        data_limite_submissao: form.data_limite_submissao
          ? new Date(form.data_limite_submissao + 'T00:00:00.000Z').toISOString()
          : undefined,
        analise_cenario: form.analise_cenario || undefined,
      };
      await pgaService.create(payload);
      toast({ title: 'PGA criado', description: `Template PGA ${form.ano} criado com sucesso.` });
      onCreated();
      onClose();
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível criar o PGA.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Novo Template PGA">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano de Referência <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={2020}
              max={2099}
              value={form.ano}
              onChange={(e) => handleChange('ano', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Versão</label>
            <input
              type="text"
              maxLength={10}
              value={form.versao ?? ''}
              onChange={(e) => handleChange('versao', e.target.value)}
              placeholder="ex: 1.0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Limite para Submissão das Unidades
          </label>
          <input
            type="date"
            value={form.data_limite_submissao ?? ''}
            onChange={(e) => handleChange('data_limite_submissao', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a]"
          />
          <p className="text-xs text-gray-400 mt-1">
            Prazo para os diretores enviarem o PGA para a regional.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Análise do Cenário (opcional)
          </label>
          <textarea
            rows={3}
            value={form.analise_cenario ?? ''}
            onChange={(e) => handleChange('analise_cenario', e.target.value)}
            placeholder="Contexto institucional, diretrizes, etc."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae0f0a] resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white"
          >
            {loading ? 'Criando...' : 'Criar Template'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
