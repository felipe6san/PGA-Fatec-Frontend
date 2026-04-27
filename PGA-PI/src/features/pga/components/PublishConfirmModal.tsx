import type { PgaComUnidade } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Calendar, Send } from 'lucide-react';
import { formatDate } from '../utils';

interface PublishConfirmModalProps {
  pga: PgaComUnidade | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function PublishConfirmModal({ pga, onClose, onConfirm, loading }: PublishConfirmModalProps) {
  if (!pga) return null;
  return (
    <Modal isOpen={!!pga} onClose={onClose} title="Liberar PGA para Unidades">
      <div className="space-y-4">
        <p className="text-gray-700">
          Ao liberar o <strong>PGA {pga.ano}</strong>, uma cópia será criada para cada{' '}
          <strong>unidade ativa</strong> do sistema. As unidades poderão então preencher e enviar
          seus PGAs.
        </p>
        {pga.data_limite_submissao && (
          <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-700">
            <Calendar className="inline h-4 w-4 mr-1" />
            Data limite para submissão:{' '}
            <strong>{formatDate(pga.data_limite_submissao)}</strong>
          </div>
        )}
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <strong>Atenção:</strong> esta ação é irreversível. O template não poderá ser editado
          após a publicação.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white gap-1"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Publicando...' : 'Confirmar Liberação'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
