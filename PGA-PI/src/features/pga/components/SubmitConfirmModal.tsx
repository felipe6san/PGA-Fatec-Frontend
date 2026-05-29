import { useEffect, useState } from 'react';
import type { PgaComUnidade } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AlertTriangle, Send } from 'lucide-react';

interface SubmitConfirmModalProps {
  pga: PgaComUnidade | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function SubmitConfirmModal({ pga, onClose, onConfirm, loading }: SubmitConfirmModalProps) {
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (!pga) setChecked(false); }, [pga]);
  if (!pga) return null;

  const isReenvio = pga.status === 'Reprovado';

  return (
    <Modal
      isOpen={!!pga}
      onClose={onClose}
      title={isReenvio ? `Reenviar PGA ${pga.ano} para Regional` : `Enviar PGA ${pga.ano} para Regional`}
    >
      <div className="space-y-5">
        <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            {isReenvio ? (
              <>
                <p className="font-semibold mb-1">Atenção: o PGA será reenviado após as correções.</p>
                <p>
                  Certifique-se de ter atendido ao parecer da Regional antes de reenviar. O status
                  voltará para <strong>Submetido</strong>.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold mb-1">
                  Atenção: esta ação não pode ser desfeita sem aprovação da Regional.
                </p>
                <p>
                  Após o envio, o PGA ficará com status <strong>Submetido</strong> e não poderá ser
                  editado até retornar da avaliação.
                </p>
              </>
            )}
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#ae0f0a] cursor-pointer flex-shrink-0"
            disabled={loading}
          />
          <span className="text-sm text-gray-700">
            {isReenvio
              ? 'Confirmo que realizei as correções solicitadas e desejo reenviar o PGA para avaliação da Regional.'
              : 'Confirmo que revisei todos os projetos e desejo enviar o PGA para avaliação da Regional.'}
          </span>
        </label>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!checked || loading}
            className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white gap-1"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Enviando...' : isReenvio ? 'Confirmar Reenvio' : 'Confirmar Envio'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
