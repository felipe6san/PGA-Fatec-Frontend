import { useState } from 'react';
import type { PgaComUnidade, StatusPGA } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Calendar, Copy, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { STATUS_LABEL, STATUS_CLASS } from '../constants';
import { formatDate, isDeadlinePast } from '../utils';

interface TemplateRowProps {
  pga: PgaComUnidade;
  onPublish: (pga: PgaComUnidade) => void;
  onEdit: (pga: PgaComUnidade) => void;
  unidadeCopias: PgaComUnidade[];
}

export function TemplateRow({ pga, onPublish, onEdit, unidadeCopias }: TemplateRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isPublished = pga.status === 'Publicado';
  const past = isDeadlinePast(pga.data_limite_submissao);

  const statusCount = unidadeCopias.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 font-semibold text-gray-900">{pga.ano}</td>

        <td className="px-4 py-3 text-gray-600">{pga.versao ?? '—'}</td>

        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[pga.status]}`}
          >
            {STATUS_LABEL[pga.status]}
          </span>
        </td>

        <td className="px-4 py-3">
          {pga.data_limite_submissao ? (
            <span
              className={`flex items-center gap-1 text-sm ${past && isPublished ? 'text-red-600 font-semibold' : 'text-gray-600'}`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(pga.data_limite_submissao)}
              {past && isPublished && <span className="text-xs">(vencida)</span>}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </td>

        <td className="px-4 py-3">
          {isPublished && unidadeCopias.length > 0 ? (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Copy className="h-3.5 w-3.5" />
              {unidadeCopias.length} unidade(s)
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          ) : isPublished ? (
            <span className="text-gray-400 text-sm">0 unidades</span>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {!isPublished && (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(pga)} className="text-xs">
                  Editar
                </Button>
                <Button
                  size="sm"
                  onClick={() => onPublish(pga)}
                  className="bg-[#ae0f0a] hover:bg-[#8e0c08] text-white text-xs gap-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  Liberar para Unidades
                </Button>
              </>
            )}
            {isPublished && (
              <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                {Object.entries(statusCount).map(([st, qty]) => (
                  <span
                    key={st}
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_CLASS[st as StatusPGA] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {STATUS_LABEL[st as StatusPGA] ?? st}: {qty}
                  </span>
                ))}
              </div>
            )}
          </div>
        </td>
      </tr>

      {expanded && isPublished && unidadeCopias.length > 0 && (
        <tr>
          <td colSpan={6} className="px-4 pb-3 bg-gray-50">
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Unidade</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Código</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Diretor</th>
                  </tr>
                </thead>
                <tbody>
                  {unidadeCopias.map((c) => (
                    <tr key={c.pga_id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{c.unidade?.nome_unidade ?? c.unidade_id}</td>
                      <td className="px-3 py-2 text-gray-500">{c.unidade?.codigo_fnnn ?? '—'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[c.status]}`}
                        >
                          {STATUS_LABEL[c.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {c.unidade?.diretor?.nome ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
