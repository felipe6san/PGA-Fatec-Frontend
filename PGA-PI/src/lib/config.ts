export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const BASE_ROUTE = import.meta.env.VITE_IS_DEV === 'true' ? '/' : '/PGA-Fatec-Frontend/';
console.log('Base route:', BASE_ROUTE);

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  USERS: `${API_URL}/users`,
};