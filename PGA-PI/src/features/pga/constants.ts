import type { StatusPGA } from '@/types/api';

export const STATUS_LABEL: Record<StatusPGA, string> = {
  EmElaboracao: 'Em Elaboração',
  Publicado: 'Publicado',
  Submetido: 'Submetido',
  Aprovado: 'Aprovado',
  AguardandoCPS: 'Aguardando CPS',
  AprovadoCPS: 'Aprovado CPS',
  Reprovado: 'Reprovado',
};

export const STATUS_CLASS: Record<StatusPGA, string> = {
  EmElaboracao: 'bg-yellow-100 text-yellow-800',
  Publicado: 'bg-blue-100 text-blue-800',
  Submetido: 'bg-purple-100 text-purple-800',
  Aprovado: 'bg-green-100 text-green-800',
  AguardandoCPS: 'bg-orange-100 text-orange-800',
  AprovadoCPS: 'bg-green-200 text-green-900',
  Reprovado: 'bg-red-100 text-red-800',
};
