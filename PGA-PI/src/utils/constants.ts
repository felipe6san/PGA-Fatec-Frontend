// Constantes da aplicação

// Constantes de paginação
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Constantes de data e hora
export const DATE_FORMAT = 'dd/MM/yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Constantes de navegação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROJECTS: '/projects',
  ADD_PROJECT: '/add-project',
  SETTINGS: '/settings',
};

// Constantes para mensagens de erro comuns
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente mais tarde.',
  UNAUTHORIZED: 'Sessão expirada. Por favor, faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
  VALIDATION: 'Há erros nos dados fornecidos. Verifique e tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet e tente novamente.',
}; 