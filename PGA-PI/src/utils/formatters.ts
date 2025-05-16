/**
 * Formata uma data para o padrão brasileiro (DD/MM/YYYY)
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formata um valor monetário para o padrão brasileiro (R$ X.XXX,XX)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Trunca um texto e adiciona "..." se exceder o limite
 */
export const truncateText = (text: string, limit: number): string => {
  if (!text || text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
}; 