export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const BASE_ROUTE = "/PGA-Fatec-Frontend/"

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  USERS: `${API_URL}/users`,
}; 