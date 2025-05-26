import { BASE_ROUTE } from '@lib/config';


export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export const DATE_FORMAT = 'dd/MM/yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

export const ROUTES = {
  HOME: `${BASE_ROUTE}`,
  LOGIN: `${BASE_ROUTE}login`,
  PROJECTS: `${BASE_ROUTE}projects`,
  ADD_PROJECT: `${BASE_ROUTE}projects/new`,
  SETTINGS: `${BASE_ROUTE}settings`,
};

export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente mais tarde.',
  UNAUTHORIZED: 'Sessão expirada. Por favor, faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
  VALIDATION: 'Há erros nos dados fornecidos. Verifique e tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet e tente novamente.',
};