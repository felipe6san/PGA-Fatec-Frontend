export function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR');
}

export function isDeadlinePast(date?: string | null): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

export function daysLeft(date?: string | null): number | null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}
