import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { AcaoProjeto, PgaComUnidade } from "@/types/api";
import { AlertTriangle, Send } from "lucide-react";

interface SubmitPgaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  pga: PgaComUnidade;
  projetos: AcaoProjeto[];
}

export function SubmitPgaModal({
  isOpen,
  onClose,
  onConfirm,
  pga,
  projetos,
}: SubmitPgaModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
      setConfirmed(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    setConfirmed(false);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Enviar PGA ${pga.ano} para Regional`}
    >
      {/* Alerta */}
      <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Atenção: esta ação não pode ser desfeita sem aprovação da Regional.</p>
          <p>Após o envio, o PGA ficará com status <span className="font-medium">Submetido</span> e aguardará avaliação. Certifique-se de que todos os projetos estão completos.</p>
        </div>
      </div>

      {/* Lista de projetos */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Projetos incluídos neste PGA ({projetos.length})
        </p>

        {projetos.length === 0 ? (
          <div className="text-sm text-gray-500 italic border border-dashed border-gray-300 rounded-lg p-4 text-center">
            Nenhum projeto cadastrado neste PGA.
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Código</th>
                  <th className="text-left px-4 py-2 font-medium">Projeto</th>
                  <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Eixo</th>
                </tr>
              </thead>
              <tbody>
                {projetos.map((p, idx) => (
                  <tr
                    key={p.acao_projeto_id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                      {p.codigo_projeto ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-800 max-w-xs truncate">
                      {p.nome_projeto ?? p.o_que_sera_feito}
                    </td>
                    <td className="px-4 py-2 text-gray-500 hidden sm:table-cell">
                      {p.eixo?.nome_eixo ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkbox de confirmação */}
      <label className="flex items-start gap-3 cursor-pointer mb-6 select-none">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[#ae0f0a] cursor-pointer flex-shrink-0"
          disabled={submitting}
        />
        <span className="text-sm text-gray-700">
          Confirmo que revisei todos os projetos e estou ciente de que o PGA será enviado para avaliação da Regional.
        </span>
      </label>

      {/* Botões */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <button
          onClick={handleClose}
          disabled={submitting}
          className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={!confirmed || submitting}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-[#ae0f0a] text-white hover:bg-[#8e0c08] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {submitting ? "Enviando..." : "Confirmar Envio"}
        </button>
      </div>
    </Modal>
  );
}
